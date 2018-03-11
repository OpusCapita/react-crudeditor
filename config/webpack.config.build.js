const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.config.common');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const nodeExternals = require('webpack-node-externals');

module.exports = merge(common, {
  plugins: [
    new LodashModuleReplacementPlugin(),
    // new UglifyJsPlugin(),
    // new BundleAnalyzerPlugin()
  ],
  entry: [
    '../src/index.js'
  ],
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
