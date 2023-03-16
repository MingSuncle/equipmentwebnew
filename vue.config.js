// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })
const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/",

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


