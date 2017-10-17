const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: resolve(__dirname, 'src'),
  entry: [
    '../../../src/client/index.js'
  ],
  // devtool: 'inline-source-map',
  output: {
    path: resolve(__dirname, '../../.gh-pages-tmp'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            ["es2015", { "modules": false }],
            "es2016",
            "es2017",
            "react",
            "stage-0"
          ],
          plugins: [
            "transform-decorators-legacy",
            "transform-class-properties",
            "transform-runtime"
          ]
        },
        exclude: /node_modules/,
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
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '../../../src/client/index.js',
      inject: "body"
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
