const fs = require('fs/promises');
const path = require('path');

const { createScript, createLink, generateHTML } = require('./util.js');

module.exports = () => {
  return {
    name: "esbuild:html",
    setup(build) {
      build.onEnd(async (buildResult) => {
        if (buildResult.errors.length) {
          return;
        }
        const { metafile } = buildResult;
        // 1. 拿到 metafile 后获取所有的 js 和 css 产物路径
        const scripts = [];
        const links = [];
        // {
        //   "inputs": { /* 省略内容 */ },
        //   "output": {
        //     "dist/index.js": {
        //       imports: [],
        //       exports: [],
        //       entryPoint: 'src/index.jsx',
        //       inputs: {
        //         'http-url:https://cdn.skypack.dev/-/object-assign@v4.1.1-LbCnB3r2y2yFmhmiCfPn/dist=es2019,mode=imports/optimized/object-assign.js': { bytesInOutput: 1792 },
        //         'http-url:https://cdn.skypack.dev/-/react@v17.0.1-yH0aYV1FOvoIPeKBbHxg/dist=es2019,mode=imports/optimized/react.js': { bytesInOutput: 10396 },
        //         'http-url:https://cdn.skypack.dev/-/scheduler@v0.20.2-PAU9F1YosUNPKr7V4s0j/dist=es2019,mode=imports/optimized/scheduler.js': { bytesInOutput: 9084 },
        //         'http-url:https://cdn.skypack.dev/-/react-dom@v17.0.1-oZ1BXZ5opQ1DbTh7nu9r/dist=es2019,mode=imports/optimized/react-dom.js': { bytesInOutput: 183229 },
        //         'http-url:https://cdn.skypack.dev/react-dom': { bytesInOutput: 0 },
        //         'src/index.jsx': { bytesInOutput: 178 }
        //       },
        //       bytes: 205284
        //     },
        //     "dist/index.js.map": { /* 省略内容 */ }
        //   }
        // }
        if (metafile) {
          const { outputs } = metafile;
          const assets = Object.keys(outputs);
          assets.forEach((asset) => {
            if (asset.endsWith('.js')) {
              scripts.push(createScript(asset))
            } else if (asset.endsWith('.css')) {
              links.push(createLink(asset))
            }
          })
        }
        // 2. 拼接 HTML 内容
        const templateContent = generateHTML(scripts, links);
        // 3. HTML 写入磁盘
        const templatePath = path.join(process.cwd(), "index.html");
        await fs.writeFile(templatePath, templateContent);
      })
    }
  }
}