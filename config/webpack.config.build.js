const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.config.common');
const nodeExternals = require('webpack-node-externals');

module.exports = merge(common, {
  entry: './crudeditor-lib/index.js',
  output: {
    path: resolve(__dirname, '../lib'),
    filename: 'index.js',
    library: `ReactCrudEditor`,
    libraryTarget: 'umd'
  },
  externals: [
    nodeExternals({
      modulesFromFile: true
    }),
  ]
});
