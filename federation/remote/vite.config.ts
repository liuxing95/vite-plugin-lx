import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import federation from '@originjs/vite-plugin-federation'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    // 模块联邦配置
    federation({
      name: 'remote-app',
      filename: 'remoteEntry.js',
      // 导出模块声明
      exposes: {
        "./Button": "./src/components/Button.tsx",
        "./App": "./src/App.tsx",
        "./utils": "./src/utils.ts",
      },
      // 共享依赖声明
      shared: ["preact"],
    })
  ],
  build: {
    target: 'esnext'
  }
})
