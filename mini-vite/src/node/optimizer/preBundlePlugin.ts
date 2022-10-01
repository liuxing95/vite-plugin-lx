import { Loader, Plugin } from "esbuild";
import { BARE_IMPORT_RE } from "../constants";
// 用来分析es模块 import/export 语句的库
import { init, parse } from 'es-module-lexer'
import path from 'path';
// 一个实现 node 路径解析算法的库
import resolve from "resolve";
// 一个更加好用的文件操作库
import fs from 'fs-extra';
// 用来开发打印debug 日志的库
import createDebug from 'debug';

const debug  = createDebug('dev');

export function preBundlePlugin(deps: Set<string>):Plugin {
  return {
    name: 'pre-bundle',
    setup(build) {
      build.onResolve(
        {
          filter: BARE_IMPORT_RE,
        },
        (resolveInfo) => {
          const { path: id, importer } = resolveInfo;
          const isEntry = !importer
          // 命中需要预编译的依赖
          if (deps.has(id)) {
            // 若为入口，则标记 dep 的 namespace
            return isEntry
            ? {
              path: id,
              namespace: 'dep'
            }
            : {
              // 因为走到 onResolve 了，所以这里的 path 就是绝对路径了
              path: resolve.sync(id, { basedir: process.cwd() }),
            }
          }
        }
      )

      // 拿到标记后的依赖，构造代理模块，交给 esbuild 打包
      build.onLoad(
        {
          filter: /.*/,
          namespace: 'dep'
        },
        async (loadInfo) => {
          await init;
          const id = loadInfo.path;
          const root = process.cwd();
          const entryPath = resolve.sync(id, { basedir: root })
          const code = await fs.readFile(entryPath, 'utf-8');
          const [imports, exports] = await parse(code);
          let proxyModule = [];
          // cjs
          if (!imports.length && !exports.length) {
            // 构建代理模块
            // 通过 require 拿到模块的导出对象
            const res = require(entryPath);
            // 用 Object.keys 拿到所有的具名导出
            const specifiers = Object.keys(res);
            // 构造 export 语句交给 Esbuild 打包
            proxyModule.push(
              `export { ${specifiers.join(",")} } from "${entryPath}"`,
              `export default require("${entryPath}")`
            )
          } else {
            // esm 格式比较好处理 export * 或者 export default即可
            // @ts-ignore
            if (exports.includes('default')) {
              proxyModule.push(`import d from "${entryPath}";export default d`);
            }
            proxyModule.push(`export * from "${entryPath}"`);
          }
          debug("代理模块内容: %o", proxyModule.join("\n"));
          const loader = path.extname(entryPath).slice(1)
          return {
            loader: loader as Loader,
            contents: proxyModule.join('\n'),
            resolveDir: root
          }
        }
      )
    },
  }
}