import { defineConfig } from 'vite';
import testHookPlugin from './test-hooks-plugin/index.js'
import virtual from './plugins/virtual-module'
import svgr from './plugins/svgr'
import alias from './plugin-alias/index.js';
const httpImport = require("./http-import-plugin/http-import-plugin");
import inspect from 'vite-plugin-inspect';
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
    inspect()
  ],
  // base: process.env.PUBLIC_URL,
  base: './',
  build: {
    outDir: 'build',
  },
});
