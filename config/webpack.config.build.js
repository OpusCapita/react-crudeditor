const { resolve } = require('path');
const webpack = require('webpack');

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
        test: /\.(png|jpg|jpeg|gif|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: ['file-loader']
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
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
};
