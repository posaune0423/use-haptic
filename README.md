<div align="center">
  <h1>use-haptic 📳</h1>
  <a href="https://github.com/posaune0423/use-haptic/actions/workflows/ci.yml"> 
    <img alt="CI" src="https://github.com/posaune0423/use-haptic/actions/workflows/ci.yml/badge.svg" />
  </a>
  <a href="https://www.npmjs.com/package/use-haptic">
    <img src="https://img.shields.io/npm/v/use-haptic.svg" alt="npm package" />
  </a>
  <a href="https://npmjs.org/package/use-haptic">
    <img alt="downloads" src="https://img.shields.io/npm/dm/use-haptic" />
  </a>  
  <a href="https://npmjs.org/package/use-haptic">
    <img alt="types included" src="https://badgen.net/npm/types/use-haptic" />
  </a>
</div>

A convenient React hook that utilizes `input[switch]` introduced in [Safari 18.0](https://webkit.org/blog/15865/webkit-features-in-safari-18-0/) to trigger haptic feedback anytime, anywhere in your application.

Try [Demo](https://use-haptic.vercel.app)

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

## Quick start

```
git clone https://github.com/posaune0423/use-haptic.git
cd sample
npm install
npm run dev
```

And then, access the ip address displayed in the console by your iPhone.

```bash
> npm run dev

> sample@0.0.0 dev
> vite --host

Port 5173 is in use, trying another one...

VITE v5.4.6 ready in 102 ms

➜ Local: http://localhost:5174/
➜ Network: http://192.xxx.xx.xxx:5174/
➜ press h + enter to show help
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

[MIT](./LICENSE)
