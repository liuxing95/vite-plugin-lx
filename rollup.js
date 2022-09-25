const rollup = require('rollup');
const util = require('util');

async function build () {
  // 目前经过 Build 阶段的 bundle 对象其实并没有进行模块的打包，这个对象的作用在于存储各个模块的内容及依赖关系，
  // 同时暴露generate和write方法，以进入到后续的 Output 阶段
  // （write和generate方法唯一的区别在于前者打包完产物会写入磁盘，而后者不会）。
  const bundle = await rollup.rollup({
    input: ['./src/index.js']
  })
  // {
  //   cache: {
  //     modules: [
  //       {
  //         ast: 'AST 节点信息，具体内容省略',
  //         code: 'export const a = 1;',
  //         dependencies: [],
  //         id: '/Users/code/rollup-demo/src/data.js',
  //         // 其它属性省略
  //       },
  //       {
  //         ast: 'AST 节点信息，具体内容省略',
  //         code: "import { a } from './data';\n\nconsole.log(a);",
  //         dependencies: [
  //           '/Users/code/rollup-demo/src/data.js'
  //         ],
  //         id: '/Users/code/rollup-demo/src/index.js',
  //         // 其它属性省略
  //       }
  //     ],
  //     plugins: {}
  //   },
  //   closed: false,
  //   // 挂载后续阶段会执行的方法
  //   close: [AsyncFunction: close],
  //   generate: [AsyncFunction: generate],
  //   write: [AsyncFunction: write]
  // }
  const result = await bundle.generate({
    format: 'es'
  })
  console.log('result:', result);
}

build()