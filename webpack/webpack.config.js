'use strict';
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        backgroundWorker: path.resolve(__dirname, '..', 'src', 'bg.ts'),
        contentAllUrlAllFrames: path.resolve(__dirname, '..', 'src', 'content_all', 'contentAllUrlAllFrames.ts'),
    },
    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    watchOptions: {
        ignored: /node_modules/
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: './dat', to: './hoge', context: 'static' },
                { from: './img', to: './img', context: 'static'},
                { from: './config', to: './config', context: 'static'},
                { from: 'manifest.json', to: 'manifest.json', context: 'static'},
            ]
        })
    ]
};
