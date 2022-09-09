const {defineConfig} = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
module.exports = defineConfig({
    publicPath: '/raffle',
    lintOnSave: false,
    transpileDependencies: true, chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = 'raffle'
                return args
            })
    },
    configureWebpack:  {
        resolve: {
            fallback: {
                fs: false,
                crypto: require.resolve("crypto-browserify")
            }
        },
        plugins: [new NodePolyfillPlugin()],
    },

})
