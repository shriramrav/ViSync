const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // mode: 'development',
    mode: "production",
    devtool: 'cheap-module-source-map',
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, 'production'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            ['@babel/preset-react', { 'runtime': 'automatic' }]
                        ]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack', 'url-loader'] 
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html'
        })
    ]
}