import { defineConfig } from 'vite';
import testHookPlugin from './test-hooks-plugin/index.js'
import virtual from './plugins/virtual-module'
import svgr from './plugins/svgr'
import alias from './plugin-alias/index.js';
const httpImport = require("./http-import-plugin/http-import-plugin");
import inspect from 'vite-plugin-inspect';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import legacy from '@vitejs/plugin-legacy';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // testHookPlugin(),
    alias({
      entries: [
        // 将把 import xxx from 'module-a' 
        // 转换为 import xxx from './module-a'
        { find: 'module-a', replacement: './module-a.js' },
      ]
    }),
    virtual(),
    svgr({
      defaultExport: 'component'
    }),
    httpImport(),
    inspect(),
    chunkSplitPlugin({
      // 指定拆包策略
      customSplitting: {
        // 1. 支持填包名。`react` 和 `react-dom` 会被打包到一个名为`render-vendor`的 chunk 里面(包括它们的依赖，如 object-assign)
        'react-vendor': ['react', 'react-dom'],
      }
    }),
    legacy({
      // 设置目标浏览器，browserslist 配置语法
      targets: ['ie >= 11'],
    })
  ],
  // base: process.env.PUBLIC_URL,
  base: './',
  build: {
    outDir: 'build',
  },
});
