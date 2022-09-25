module.exports = () => ({
  name: 'esbuild:http',
  setup(build) {
    let https = require('https');
    let http = require('http');

    // 拦截http请求
    // 控制路径解析
    build.onResolve({
      // filter 为必传参数，是一个正则表达式，它决定了要过滤出的特征文件。
      // namespace 为选填参数
      filter: /^https?:\/\//
    }, (args) => {
      // 模块路径
      // console.log(args.path)
      // // 父模块路径
      // console.log(args.importer)
      // // namespace 标识
      // console.log(args.namespace)
      // // 基准路径
      // console.log(args.resolveDir)
      // // 导入方式，如 import、require
      // console.log(args.kind)
      // // 额外绑定的插件数据
      // console.log(args.pluginData)


      // 返回信息
      // // 错误信息
      // errors: [],
      // // 是否需要 external
      // external: false;
      // // namespace 标识
      // namespace: 'env-ns';
      // // 模块路径
      // path: args.path,
      // // 额外绑定的插件数据
      // pluginData: null,
      // // 插件名称
      // pluginName: 'xxx',
      // // 设置为 false，如果模块没有被用到，模块代码将会在产物中会删除。否则不会这么做
      // sideEffects: false,
      // // 添加一些路径后缀，如`?xxx`
      // suffix: '?xxx',
      // // 警告信息
      // warnings: [],
      // // 仅仅在 Esbuild 开启 watch 模式下生效
      // // 告诉 Esbuild 需要额外监听哪些文件/目录的变化
      // watchDirs: [],
      // watchFiles: []
      return {
        // 模块路径
        path: args.path,
        namespace: "http-url",
      }
    })

    // 拦截间接依赖的路径
    // tip: 间接依赖同样会被自动带上 `http-url`的namespace
    build.onResolve({ filter: /.*/, namespace: 'http-url'}, (args) => {
      console.log('重写间接依赖的路径', new URL(args.path, args.importer).toString())
      return {
      // 重写路径
      path: new URL(args.path, args.importer).toString(),
      namespace: "http-url",
    }})


    // 2. 通过fetch 请求加载CDN资源
    build.onLoad({
      filter: /.*/,
      namespace: 'http-url'
    }, async (args) => {
      // 模块路径
      // console.log(args.path);
      // // namespace 标识
      // console.log(args.namespace);
      // // 后缀信息
      // console.log(args.suffix);
      // // 额外的插件数据
      // console.log(args.pluginData);
      //   return {
      //     // 模块具体内容
      //     contents: '省略内容',
      //     // 错误信息
      //     errors: [],
      //     // 指定 loader，如`js`、`ts`、`jsx`、`tsx`、`json`等等
      //     loader: 'json',
      //     // 额外的插件数据
      //     pluginData: null,
      //     // 插件名称
      //     pluginName: 'xxx',
      //     // 基准路径
      //     resolveDir: './dir',
      //     // 警告信息
      //     warnings: [],
      //     // 同上
      //     watchDirs: [],
      //     watchFiles: []
      // }
      let contents = await new Promise((resolve, reject) => {
        function fetch(url) {
          console.log(`Downloading: ${url}`);
          let lib = url.startsWith("https") ? https : http;
          let req = lib.get(url, (res) => {
            if ([301, 302, 307].includes(res.statusCode)) {
              // 重定向
              fetch(new URL(res.headers.location, url).toString());
              req.abort();
            } else if (res.statusCode === 200) {
              // 响应成功
              let chunks = [];
              res.on('data', (chunk) => chunks.push(chunk));
              res.on('end', () => resolve(Buffer.concat(chunks)))
            } else {
              reject(
                new Error(`GET ${url} failed: status ${res.statusCode}`)
              )
            }
          }).on('error', reject)
        }
        fetch(args.path)
      })
      return {
        contents
      }
    })
  }
})