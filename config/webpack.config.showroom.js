const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: resolve(__dirname, '../src'),
  entry: [
    '../www/index-page.js'
  ],
  output: {
    path: resolve(__dirname, '../.gh-pages-tmp'),
    filename: 'bundle.js'
  },
  // if we need to start showroom on our computer
  devServer: {
    contentBase: './.gh-pages-tmp',
    historyApiFallback: true,
    inline: false
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
            [
              "transform-runtime", { "polyfill": false } // Fix for https://github.com/babel/babel/issues/2877
            ],
            "transform-object-rest-spread"
          ]
        },
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
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          'url-loader?limit=100&mimetype=application/font-woff&name=[name].[ext]',
        ]
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          'url-loader?limit=100&mimetype=application/octet-stream&name=[name].[ext]',
        ]
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          'file-loader?name=[name].[ext]',
        ]
      },
      {
        test: /\.md$/,
        loader: 'raw-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '../www/index.html',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
