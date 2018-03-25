module.exports = _ => ({
  babelrc: false,
  ignore: /node_modules\/(?!lodash-es)/,
  presets: [
    [
      'env',
      process.env.NODE_ENV === 'test' ? {
        targets: {
          node: 'current'
        }
      } : {
        targets: {
          browsers: [
            'chrome >= 64',
            'firefox ESR',
            'ie >= 11',
            'safari >= 11'
          ]
        },
        modules: false
      }
    ],
    'stage-3',
    'react'
  ],
  plugins: [
    // make sure that 'transform-decorators' comes before 'transform-class-properties'
    'transform-decorators',
    'transform-class-properties',
    ['transform-runtime', { 'polyfill': false }],
    'transform-export-extensions'
  ],
  env: {
    test: {
      plugins: ['istanbul']
    }
  }
});
