/**
 * Config file for bundling
 */

const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require("mini-css-extract-plugin");

const DIST_PATH = path.resolve(__dirname, "dist");

module.exports = {
    mode: 'development',
    entry: {                                    // Defines where webpack begins creating dependency graph
        popup: './src/backend/popup.js',
        background: './src/backend/background.js'
    },
    plugins: [
        new htmlWebpackPlugin({
            title: 'Subreddit Time Filter',     // Creates a html doc, auto updates for any change in entry point names
            filename: 'popup.html',
            template: './src/frontend/popup.html',
            inject: 'body'
        }),
        new miniCssExtractPlugin({
            filename: '[name].css'
        })],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [miniCssExtractPlugin.loader, "css-loader"],
            },
        ],
    },
    output: {
        filename: '[name].bundle.js',           // Specifies where to place the bundled files
        path: DIST_PATH,
        clean: true                             // Removes any old unused files
    }
}