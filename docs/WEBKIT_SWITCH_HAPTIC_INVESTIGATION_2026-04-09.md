# WebKit switch haptic 調査メモ

日付: 2026-04-09

## 調査対象

`use-haptic` は hidden な `<label>` から hidden な
`<input type="checkbox" switch>` へ click を転送する実装を使っていた。
その後、label 経由をやめて `input.click()` の直接呼び出しへ切り替えたが、要素は
`display: none` のままだった。

`iOS 26.5 beta` の実機確認では、この状態でも haptic は発火しなかった。一方で、
renderable な switch input に対して `click()` を直接呼ぶと haptic が発火する。

この文書は、その実装変更の根拠として確認した公開 WebKit 情報をまとめたもの。

## 根拠一覧

| 日付           | ソース                                                                                         | ID                                                    | 種別     | 要点                                                                                                                                                                               |
| -------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2023-12-05     | https://github.com/WebKit/WebKit/pull/21156                                                    | PR #21156 / 271542@main                               | 背景     | WebKit は `input[type=checkbox][switch]` の trusted click や pointer tracking の責務を `CheckboxInputType` 側へ寄せている。                                                        |
| 2025-01-03     | https://bugs.webkit.org/show_bug.cgi?id=285120                                                 | bug 285120                                            | 直接証拠 | bug のタイトルとパッチ説明が、switch haptic feedback に user activation を要求する変更であることを示している。                                                                     |
| 2025-01-03     | https://github.com/WebKit/WebKit/pull/38473                                                    | PR #38473 / 288403@main                               | 直接証拠 | PR 本文に「script alone では switch haptic feedback を発火できないようにする」と明記されている。                                                                                   |
| 2025-01-03     | https://github.com/WebKit/WebKit/commit/dfb3971bb0d9ef84f41784e277404aa10a5ad5f3               | `dfb3971` / 288403@main                               | 直接証拠 | `CheckboxInputType::performSwitchVisuallyOnAnimation` に `trigger == SwitchTrigger::Click && !UserGestureIndicator::processingUserGesture()` の early return が追加されている。    |
| current `main` | https://github.com/WebKit/WebKit/blob/main/Source/WebCore/html/HTMLLabelElement.cpp            | `HTMLLabelElement::defaultEventHandler`               | 補強証拠 | label activation 自体は今も関連 control に `dispatchSimulatedClick` を転送している。つまり label 経路そのものが消えたわけではない。                                                |
| current `main` | https://github.com/WebKit/WebKit/blob/main/Source/WebCore/dom/Element.cpp                      | `Element::dispatchSimulatedClick`                     | 補強証拠 | simulated click dispatch は今も `SimulatedClickSource::UserAgent` を使っている。label から control への転送実装が単純に削除された形跡はない。                                      |
| current `main` | https://github.com/WebKit/WebKit/blob/main/Source/WebCore/html/CheckboxInputType.cpp           | `CheckboxInputType::performSwitchVisuallyOnAnimation` | 直接証拠 | switch haptic に対する user activation gate は current `main` にも残っている。                                                                                                     |
| current `main` | https://raw.githubusercontent.com/WebKit/WebKit/main/Source/WebCore/html/CheckboxInputType.cpp | `CheckboxInputType::performSwitchAnimation`           | 直接証拠 | switch animation は `!element->renderer()` または `!element->renderer()->style().hasUsedAppearance()` の場合に return する。`display: none` の switch はここで落ちる可能性が高い。 |

## 公開ソースから読み取れること

1. WebKit は `288403@main` で switch haptic feedback に対する明示的な guard
   を追加している。
2. その変更の目的は、script 単独では haptic を発火できないようにすること。
3. このライブラリの旧実装は switch 要素そのものへの直接 click ではなく、hidden
   label 経由の転送 click に依存していた。
4. current `main` にも label 転送コードは残っているため、最も自然な解釈は「label
   click が消えた」ではなく、「forward された click 経路が haptic 実行時点で
   user gesture として認められなくなった」というもの。
5. さらに current `main` では switch animation 自体が `renderer` と
   `hasUsedAppearance()` を前提にしているため、`display: none` の switch は
   direct click でも haptic 経路に乗れない可能性が高い。
6. そのため、`iOS 26.5 beta` で安定して haptic を出すには、 `input[switch]` を
   direct に click するだけでなく、要素を renderable のまま
   視覚的に隠す必要がある。

## 確度と制約

- 高確度: `288403@main` は公開されている実在の WebKit 変更であり、switch haptic
  の activation 条件を厳しくしている。
- 高確度: `display: none` の switch を使う実装は、current `main` の
  `performSwitchAnimation()` の条件と整合しない。
- 中程度の確度: `iOS 26.5 beta`
  で観測された回帰は、この変更そのもの、またはこれに近い Apple 内部ブランチ上の
  event / activation 調整の影響である可能性が高い。
- 制約: 公開 WebKit の commit / PR の中には、「label click が switch haptic
  を通さなくなった」と明示した変更は見つかっていない。実際の shipping build
  に含まれる差分が Apple 内部のみで管理されている可能性は残る。

## ライブラリ側の判断

最終的なライブラリ実装は、programmatic な `triggerHaptic()` に iOS haptic を
期待しない方針へ切り替えた。

- iOS では、利用側が `ref` を付けた target 要素の上に transparent な native
  `input[type=checkbox][switch]` を重ねる
- ユーザーはその native switch を直接押し、WebKit の許容する経路で haptic を出す
- その後で元の target 要素へ click を forward する

この構成により、public hook interface は保ちつつ、公開 WebKit が導入した
stricter な user activation モデルに合わせる。
