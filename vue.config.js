module.exports = {
    lintOnSave: false,
    configureWebpack: (config) => {
        config.module.rules.push({
            test: /\.js$/,
            use: [{
                loader: require.resolve('@open-wc/webpack-import-meta-loader'),
            }]
        })
    },
    chainWebpack: config => {
        // 用cdn方式引入
        config.externals({
            'vue': 'Vue',
            'element-ui': 'ELEMENT',
            'echarts': 'echarts',
            'axios': 'axios',
        })
    },
    devServer: {
        port: 10005,
    }
}