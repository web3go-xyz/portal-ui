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

        // js output config
        config.output.filename = "[name].[hash].js";
        config.output.chunkFilename = "[name].[hash].js";

        config.optimization = {
            splitChunks: {
                cacheGroups: {
                    common: {
                        //抽取所有入口页面都需要的公共chunk
                        name: "chunk-common",
                        chunks: "initial",
                        minChunks: 2,
                        maxInitialRequests: 5,
                        minSize: 0,
                        priority: 1,
                        reuseExistingChunk: true,
                        enforce: true
                    }
                }
            }
        };


    },
    chainWebpack: config => {
        // 删除默认的splitChunk
        config.optimization.delete("splitChunks");

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
            chunks: ["embed", "chunk-common"]
        },
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            chunks: ["index", "chunk-common"]
        },
    },
}