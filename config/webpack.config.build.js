const { resolve } = require('path');
const webpack = require('webpack');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  context: resolve(__dirname, '../src'),
  entry: [
    '../src/index.js'
  ],
  output: {
    path: resolve(__dirname, '../lib'),
    filename: 'index.js',
    library: `ReactCrudEditor`,
    libraryTarget: 'umd'
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    }
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            ["env",
              {
                "modules": false,
                "targets": {
                  "browsers": ["last 2 versions", "ie >= 11", "safari >= 7", "Firefox ESR"]
                }
              }
            ],
            "react"
          ],
          plugins: [
            "transform-decorators-legacy",
            "transform-class-properties",
            "transform-runtime",
            "transform-object-rest-spread"
          ]
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|jpeg|gif|ttf|eot|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: ['file-loader']
      },
      {
        test: /\.(svg)(\?[a-z0-9=&.]+)?$/,
        use: ['raw-loader']
      },
      {
        test: /\.(css|less)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'less-loader', options: { sourceMap: true } },
          {
            loader: 'postcss-loader', options: {
              plugins: (loader) => [
                require('precss')(),
                require('autoprefixer')()
              ]
            }
          }
        ]
      },
      {
        test: /\.(scss)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    // new UglifyJsPlugin(),
    // new BundleAnalyzerPlugin(),
    new LodashModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
};
