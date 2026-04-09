import { fileURLToPath, URL } from "node:url";
import { defineConfig, type PluginOption } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { qrcode } from "vite-plugin-qrcode";

// https://vite.dev/config/
export default defineConfig({
  plugins: [deno() as PluginOption, react(), qrcode() as PluginOption],
  resolve: {
    alias: {
      "use-haptic": fileURLToPath(new URL("../../src/mod.ts", import.meta.url)),
    },
  },
});
