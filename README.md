# use-haptic

<div align="center">
  <a href="https://github.com/posaune0423/use-haptic/actions/workflows/ci.yml"> 
    <img alt="CI" src="https://github.com/posaune0423/use-haptic/actions/workflows/ci.yml/badge.svg" />
  </a>
  <a href="https://www.npmjs.com/package/use-haptic">
    <img alt="npm" src="https://img.shields.io/npm/v/use-haptic.svg" />
  </a>
  <a href="https://npmjs.org/package/use-haptic">
    <img alt="downloads" src="https://badgen.net/npm/dm/use-haptic" />
  </a>  
  <a href="https://npmjs.org/package/use-haptic">
    <img alt="types included" src="https://badgen.net/npm/types/use-haptic" />
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
