<div align="center">

<h1>use-haptic 📳</h1>

<p>A convenient React hook to trigger haptic feedback anywhere in your application</p>

<p>
      <a href="https://jsr.io/@posaune0423/use-haptic">
        <img src="https://jsr.io/badges/@posaune0423/use-haptic" alt="" />
      </a>
      <a href="https://jsr.io/@posaune0423/use-haptic">
        <img src="https://jsr.io/badges/@posaune0423/use-haptic/score" alt="" />
      </a>
      <a href="https://github.com/posaune0423/use-haptic/actions/workflows/ci.yml">
        <img alt="CI" src="https://github.com/posaune0423/use-haptic/actions/workflows/ci.yml/badge.svg" />
      </a>
      <a href="https://www.npmjs.com/package/use-haptic">
        <img src="https://img.shields.io/npm/v/use-haptic.svg" alt="npm package" />
      </a>
      <a href="https://npmjs.org/package/use-haptic">
        <img alt="downloads" src="https://img.shields.io/npm/d18m/use-haptic" />
      </a>
  </p>

<h2>
      <a href="https://kjwzkv.csb.app">Try Demo!</a>
  </h2>
</div>

## ✨ Overview

This package utilizes the `input[switch]` element introduced in
[Safari 18.0](https://webkit.org/blog/15865/webkit-features-in-safari-18-0/) to
trigger haptic feedback in React applications.

On current iOS / WebKit, arbitrary programmatic haptic triggering is no longer
reliable. The supported path is to let the user directly interact with a native
`input[switch]`. `useHaptic()` now reflects that:

- On iOS Safari, attach `ref` to the pressed element
- On Android and other browsers, keep using `triggerHaptic()`

## 🚀 Features

- ✅ Attach haptic behavior to any single React DOM target with `ref`
- ✅ Support iOS, Android
- ✅ Simple, intuitive API
- ✅ Native TypeScript support by 🦕
- ✅ ESM / CJS compatible
- ✅ jsr / npm compatible

## 📦 Installation

```bash
npm install use-haptic
```

```bash
yarn add use-haptic
```

```bash
pnpm install use-haptic
```

```bash
bun add use-haptic
```

```bash
deno add jsr:@posaune0423/use-haptic
```

## 🔧 Usage

```tsx
import { useHaptic } from "use-haptic";

function HapticButton() {
  const { ref } = useHaptic();

  return (
    <button onClick={() => console.log("pressed")} ref={ref} type="button">
      Feel Haptic
    </button>
  );
}
```

The hook places a transparent native `input[switch]` on top of the referenced
element so Safari treats the interaction as a direct switch press.

One `useHaptic()` instance manages one DOM target. If you need haptics on
multiple elements, call the hook separately for each one.

## Android / Programmatic Trigger

```tsx
import { useHaptic } from "use-haptic";

function AndroidButton() {
  const { triggerHaptic } = useHaptic();

  return (
    <button
      onClick={() => {
        triggerHaptic();
      }}
      type="button"
    >
      Vibrate
    </button>
  );
}
```

`triggerHaptic()` still uses `navigator.vibrate()` on non-iOS browsers, but it
should no longer be considered a reliable arbitrary-trigger API on modern iOS
Safari.

## 🏃‍♂️ Quick Start

Clone the repository and run the sample app:

```bash
git clone https://github.com/posaune0423/use-haptic.git
cd sample/deno-vite-react
deno task dev
```

You can visit the demo page by scanning the QR code displayed in the terminal.

## 🧰 Development

### Publishing to npm

This package uses [dnt](https://github.com/denoland/dnt) for npm package
preparation:

```bash
# Build the package
deno run -A scripts/build_npm.ts <version>

# Publish to npm
cd npm
npm publish
```

## 📄 License

[MIT](./LICENSE)
