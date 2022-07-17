const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    entry: "./src/sw.js",
    output: {
        path: path.resolve(__dirname, 'production'),
        filename: 'sw.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack', 'url-loader'] 
            }
        ]
    }
}