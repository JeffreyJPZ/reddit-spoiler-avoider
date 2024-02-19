/**
 * Config file for bundling
 */

const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');
const copyPlugin = require('copy-webpack-plugin');

const DIST_PATH = path.resolve(__dirname, "dist");

module.exports = [
    {
        mode: 'production',
        entry: {                                    // Defines where webpack begins creating dependency graph
            popup: './src/backend/popup.js',
            options: './src/backend/options.js',
            background: './src/backend/background.js',
            content: './src/backend/scripts/content.js',
        },
        plugins: [
            new htmlWebpackPlugin({
                title: 'Subreddit Time Filter',     // Creates a html doc, auto updates for any change in entry point names
                filename: 'popup.html',
                template: './src/frontend/popup.html',
                inject: 'body',
                chunks: ['popup']
            }),
            new htmlWebpackPlugin({
                title: 'Filter Options',     // Creates a html doc, auto updates for any change in entry point names
                filename: 'options.html',
                template: './src/frontend/options.html',
                inject: 'body',
                chunks: ['options']
            }),
            new miniCssExtractPlugin({      // Keeps css separate
                filename: '[name].css'
            }),
            new webpackExtensionManifestPlugin({    // Builds manifest
                config: {
                    base: 'manifest.json'
                }
            }),
            new copyPlugin({
                patterns: [
                    {from: './src/icons', to: 'static'}
                ]
            })],
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [miniCssExtractPlugin.loader, 'css-loader']
                },
                {
                    test: /\.js$/i,
                    loader: 'babel-loader',
                    exclude: /(node_modules)/
                }
            ],
        },
        output: {
            filename: 'js/[name].js',           // Specifies where to place the bundled files
            path: DIST_PATH,
            clean: true                      // Removes any old unused files
        }
    },
];