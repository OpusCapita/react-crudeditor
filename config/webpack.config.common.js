const { resolve } = require('path');
const babelConfig = require('./babel-config');

const mode = process.env.NODE_ENV || 'production';
const devMode = mode === 'development';

module.exports = {
  mode: mode,
  context: resolve(__dirname, '../src'),
  entry: [
    'core-js/fn/object/assign' // required for IE11 and react-notifications module
  ],
  module: {
    rules: [
      {
        test: /\.(jsx?|mjs)$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader', options: babelConfig }
        ]
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
          {
            loader: 'style-loader', options: {
              singleton: false, // As a recomendation in "style-loader" GitHub repo's issue #312.
              sourceMap: devMode,
              convertToAbsoluteUrls: devMode,
              hmr: devMode
            }
          },
          {
            loader: 'css-loader', options: {
              sourceMap: devMode,
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader', options: {
              ident: 'postcss',
              sourceMap: devMode && 'inline',
              plugins: [
                require('precss')(),
                require('autoprefixer')()
              ]
            }
          },
          {
            loader: 'less-loader', options: {
              sourceMap: devMode
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'url-loader', options: {
            limit: 100,
            mimetype: 'application/font-woff',
            name: '[name].[ext]'
          }
        }]
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'url-loader', options: {
            limit: 100,
            mimetype: 'application/octet-stream',
            name: '[name].[ext]'
          }
        }]
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader', options: {
            name: '[name].[ext]'
          }
        }]
      }
    ]
  }
};
