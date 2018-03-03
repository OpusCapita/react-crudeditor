const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.config.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  plugins: [
    new HtmlWebpackPlugin({
      template: './demo/client/index.html',
      inject: "body"
    })
  ],
  entry: './demo/client/index.js',
  devtool: 'inline-source-map',
  output: {
    path: resolve(__dirname, '../public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  devServer: {
    contentBase: './public',
    historyApiFallback: true,
    inline: false
  }
});

