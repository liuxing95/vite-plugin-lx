// @rollup/plugin-node-resolve是为了允许我们加载第三方依赖，否则像import React from 'react' 的依赖导入语句将不会被 Rollup 识别。
import resolve from "@rollup/plugin-node-resolve";
// @rollup/plugin-commonjs 的作用是将 CommonJS 格式的代码转换为 ESM 格式
import commonjs from "@rollup/plugin-commonjs";
import { terser } from 'rollup-plugin-terser'
import alias from '../plugin-alias/index.js';
// import alias from '@rollup/plugin-alias';

/**
 * @type { import('rollup').RollupOptions }
 */
 export default {
  input: ["src/index.js"],
  output: {
    dir: 'dist',
    // 加入 terser 插件，用来压缩代码
    // 需要注意的是，output.plugins中配置的插件是有一定限制的，只有使用Output 阶段相关钩子(具体内容将在下一节展开)的插件才能够放到这个配置中，
    plugins: [terser()]
  },
  // 通过 plugins 参数添加插件
  plugins: [resolve(), commonjs(), alias({
    entries: [
      // 将把 import xxx from 'module-a' 
      // 转换为 import xxx from './module-a'
      { find: 'module-a', replacement: './module-a.js' },
    ]
  })],
};