const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.config.common');

module.exports = merge(common, {
  plugins: [
    new HtmlWebpackPlugin({
      template: '../www/index.html',
    })
  ],
  entry: [
    '../www/index-page.js'
  ],
  output: {
    path: resolve(__dirname, '../.gh-pages-tmp'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './.gh-pages-tmp',
    historyApiFallback: true,
    inline: false
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        use: ['raw-loader']
      }
    ]
  }
});
