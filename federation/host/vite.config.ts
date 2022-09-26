import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    federation({
      // 远程模块声明
      remotes: {
        remote_app: "http://localhost:3001/assets/remoteEntry.js",
      },
      // 共享依赖声明
      shared: ["preact"],
    }),
  ],
  build: {
    target: "esnext",
  },
})
