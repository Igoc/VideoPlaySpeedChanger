const eslintFriendlyFormatter = require('eslint-friendly-formatter');
const path                    = require('path');
const webpack                 = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin    = require('uglifyjs-webpack-plugin');

const config = {
    mode: 'production',
    context: path.resolve(__dirname, '../'),
    entry: './src/main.js',
    devtool: false,
    output: {
        path: path.resolve(__dirname, '../dist/'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                exclude: '/node_modules/',
                options: {
                    formatter: eslintFriendlyFormatter,
                    emitWarning: true
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: 'static',
                ignore: ['.*']
            }
        ]),
        new ExtractTextPlugin({
            filename: '[name].[contenthash].css',
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        new OptimizeCSSPlugin({
            cssProcessorOptions: false
        }),
        new UglifyJsPlugin({
            sourceMap: false,
            parallel: true
        })
    ]
};

module.exports = config;