
const path = require('path')

let isDev = process.env.NODE_ENV === 'development'
let isProd = !isDev
const HTMLWebpackPlugin = require('html-webpack-plugin')
let fileName = (ext) => {
    return `[name].${ext}`
}
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const miniCssExtractTextPlugin = require('mini-css-extract-plugin')
let devServer = require('webpack-dev-server')
const copyWebpackPligin = require('copy-webpack-plugin')
const OptimazeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

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
        new CleanWebpackPlugin(),

        new miniCssExtractTextPlugin({
            filename: `./css/${fileName('css')}`, // можно переименвать файл
        }),
        new copyWebpackPligin({
            patterns: [
                { from: path.resolve(__dirname, 'src/assets/'), to: path.resolve(__dirname, 'app/assets') },
                { from: path.resolve(__dirname, 'src/robots.txt'), to: path.resolve(__dirname, 'app') },
                { from: path.resolve(__dirname, 'src/img/'), to: path.resolve(__dirname, 'app/img') },
                //{ from: path.resolve(__dirname, 'src/manifest.json'), to: path.resolve(__dirname, 'app/manifest.json') }
            ]
        }),
    ]

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
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, 'app'),
        open: true,
        compress: true,
        hot: true,
        port: 3000,
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
                    }
                }],
            },
            {
                test: /\.js/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(?:|ttf|otf|)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: `./fonts/${fileName('[ext]')}`,
                    }
                }],
            }
        ],
    },
}


