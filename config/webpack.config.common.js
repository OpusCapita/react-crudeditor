const { resolve } = require('path');
const webpack = require('webpack');
const babelConfig = require('./babel-config')();

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  context: resolve(__dirname, '../src'),
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        use: ['babel-loader'],
        options: babelConfig,
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|jpeg|gif|ttf|eot)(\?[a-z0-9=&.]+)?$/,
        use: ['file-loader']
      },
      {
        test: /\.(svg)(\?[a-z0-9=&.]+)?$/,
        use: ['raw-loader']
      },
      {
        test: /\.(css|less)$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'less-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: {
            plugins: (loader) => [
              require('precss')(),
              require('autoprefixer')()
            ]
          }}
        ]
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{ loader: 'url-loader', options: {
          limit: 100,
          mimetype: 'application/font-woff',
          name: '[name].[ext]'
        }}]
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: [{ loader: 'url-loader', options: {
          limit: 100,
          mimetype: 'application/octet-stream',
          name: '[name].[ext]'
        }}]
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: [{ loader: 'file-loader', options: {
          name: '[name].[ext]'
        }}]
      }
    ]
  }
};
