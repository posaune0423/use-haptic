# use-haptic

<div align="center">
  <a href="https://www.npmjs.com/package/use-haptic">
    <img alt="npm" src="https://img.shields.io/npm/v/use-haptic.svg?labelColor=49516F&color=8994BC" />
  </a>
  <a href="https://npmjs.org/package/use-haptic">
    <img alt="downloads" src="https://badgen.net/npm/dm/use-haptic?labelColor=49516F&color=8994BC" />
  </a>
  <a href="https://bundlephobia.com/result?p=use-haptic">
    <img alt="tree-shakeable" src="https://badgen.net/bundlephobia/tree-shaking/use-haptic?labelColor=49516F&color=8994BC" />
  </a>
  <a href="https://npmjs.org/package/use-haptic">
    <img alt="types included" src="https://badgen.net/npm/types/use-haptic?labelColor=49516F&color=8994BC" />
  </a>
</div>

A convenient React hook that utilizes `input[switch]` introduced in [Safari 18.0](https://webkit.org/blog/15865/webkit-features-in-safari-18-0/) to trigger haptic feedback anytime, anywhere in your application.

## Features

- Trigger haptic feedback at any time in your React application
- Simple API

## Install

```bash
npm install use-haptic
yarn add use-haptic
pnpm add use-haptic
bun add use-haptic
```

## Usage

```tsx
import { useHaptic } from "use-haptic";

function VibrationButton() {
  const { vibe } = useHaptic();
  return <button onClick={vibe}>Vibe</button>;
}
```

## License

MIT
