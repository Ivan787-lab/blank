//npm install webpack cross-env path clean-webpack-plugin mini-css-extract-plugin html-webpack-plugin webpack-dev-server copy-webpack-plugin file-loader css-loader sass-loader sass webpack optimize-css-assets-webpack-plugin imagemin-webpack  --save-dev
//npm install -D webpack-cli
//npm install -D babel-loader @babel/core @babel/preset-env webpack

const path = require('path')
/* npm install cross env --save-dev  позволяет определять переменную NODE_ENV*/
let isDev = process.env.NODE_ENV === 'development'
let isProd = !isDev
const HTMLWebpackPlugin = require('html-webpack-plugin')
let fileName = (ext) => {
    return `[name].${ext}`
}
const { cleanWebpackPlugin } = require('clean-webpack-plugin')
const miniCssExtractTextPlugin = require('mini-css-extract-plugin')
let devServer = require('webpack-dev-server')
const copyWebpackPlugin = require('copy-webpack-plugin')
const OptimazeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack')
const optimization = () => {
    const configObj = {
        splitChunks: {
            chunks: 'all'
        }
    };

    if (isProd) {
        configObj.minimizer = [
            new OptimazeCssAssetWebpackPlugin(),
            new TerserWebpackPlugin()
        ];
    }
    return configObj;
}

const plugins = () => {
    const basePlugins = [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            minify: {
                collapseWhitespace: isProd,
            },
            path: path.resolve(__dirname, 'app')
        }),
        new miniCssExtractTextPlugin({
            filename: `./css/${fileName('css')}`, // можно переименвать файл
        }),
        new copyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'src/assets'), to: path.resolve(__dirname, 'app/assets') },
                { from: path.resolve(__dirname, 'src/img'), to: path.resolve(__dirname, 'app/img') },

            ]
        })
    ]
    if (isProd) {
        basePlugins.push(
            new ImageminPlugin({
                bail: false,
                cache: true,
                imageminOptions: {
                    plugins: [
                        ["gifsicle", { interlaced: true }],
                        ["jpegtran", { progressive: true }],
                        ["optipng", { optimizationLevel: 5 }],
                        [
                            "svgo",
                            {
                                plugins: [
                                    {
                                        removeViewBox: false
                                    }
                                ]
                            }
                        ]
                    ]
                }
            })
        )
    }
    return basePlugins
};

module.exports = {
    context: path.resolve(__dirname, 'src'), // создание контекста для сборки
    entry: './js/main.js', // точка откуда начинается сборка проекта. Тк я сделал контекст не нужно указывать ./src/js/script.js
    mode: 'development', // указываю мод для сборки
    output: {
        filename: `./js/${fileName('js')}`, // можно переименвать файл
        path: path.resolve(__dirname, 'app'),
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'app'),
        compress: true,
        port: 5555,
        open: true,
    },
    optimization: optimization(),
    plugins: plugins(),
    devtool: isProd ? false : 'source-map',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [miniCssExtractTextPlugin.loader, 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: miniCssExtractTextPlugin.loader,
                        options: {
                            publicPath: (resourcePath, context) => {
                                return path.relative(path.dirname(resourcePath), context) + '/'
                            }
                        }
                    },
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(?:|gif|png|jpg|jpeg|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: `./img/${fileName('[ext]')}`
                    },
                }],
            },

            {
                test: /\.js/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.ttf$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: `./fonts/${fileName('[ext]')}`
                    }
                }],
            }
        ],
    },

}


