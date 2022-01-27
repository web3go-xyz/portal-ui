const webpack = require("webpack");
module.exports = {
    lintOnSave: false,
    configureWebpack: (config) => {
        config.module.rules.push({
            test: /\.js$/,
            use: [{
                loader: require.resolve('@open-wc/webpack-import-meta-loader'),
            }]
        });

    },
    chainWebpack: config => {
        // 用cdn方式引入
        config.externals({
            'vue': 'Vue',
            'element-ui': 'ELEMENT',
            'echarts': 'echarts',
            'axios': 'axios',
        });
        config
            .plugin("ignore")
            .use(
                new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en$/)
            );

        return config;
    },
    devServer: {
        port: 10005,
    },
    parallel: false,


    pages: {
        embed: {
            entry: 'src/embed/embed.main.js',
            template: 'public/embed.html',
        },
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
        },
    },
}