const webpack = require('webpack'),
    path = require('path'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    FileIncludeWebpackPlugin = require('file-include-webpack-plugin');

const isDev = process.env.NODE_DEV === 'development';

module.exports = {
    mode: "development",
    context: path.resolve(__dirname, 'src'),
    entry: './js/app.js',
    externals: {
        jquery: 'jQuery',
    },
    output: {
        assetModuleFilename: "[file]",
        filename: './js/app.js',
        path: path.resolve(__dirname, './')
    },
    plugins: [      
        new FileIncludeWebpackPlugin({
            source: '/html/pages/',
            destination: './',
        }),
        // new webpack.ProvidePlugin({
        //     $: "jquery/dist/jquery.min.js",
        //     jQuery: "jquery/dist/jquery.min.js",
        //     "window.jQuery": "jquery/dist/jquery.min.js"
        // }),
        new MiniCssExtractPlugin({
            filename: './css/app.css'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './images',
                    to: './images'
                },
                {
                    from: './models',
                    to: './models'
                }
            ]
        })
    ],
    devServer: {
        port: 3000,
    },
    module: {
        rules: [
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: './images/'
                },
                generator: {
                    emit: false
                }
            },
            {
                test: /\.(obj|glb)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: './models/'
                },
                generator: {
                    emit: false
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: true
                        } 
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.(woff|woff2|ttf|eot)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                },
                generator: {
                    emit: false
                }
            }
        ]
    },
    output: {
        publicPath: !isDev ? 'https://maks28925.github.io/one-place' : '/',
  }
}