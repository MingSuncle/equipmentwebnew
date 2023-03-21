// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })
const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production'
  ? '/equipmentnew/'
  : '/',

  outputDir: 'equipmentnew', // 输出目录，默认是dist
  
  // 输出的资源的目录 
  assetsDir: 'static',
  // 生产环境是否生成 sourceMap 文件,资源地图,可以定位控制台输出语句所在文件位置
  productionSourceMap: true,

  configureWebpack() {
    plugins: [new NodePolyfillPlugin()]
    return {
      resolve: {
        fallback: {
          http: require.resolve("stream-http"),
        },
      },
    }
  },
})


