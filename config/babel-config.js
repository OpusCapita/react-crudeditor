module.exports = {
  babelrc: false,
  ignore: /node_modules\/(?!lodash-es)/,
  presets: [
    ['env', {
      targets: {
        browsers: [
          'chrome >= 64',
          'firefox ESR',
          'ie >= 11',
          'safari >= 11'
        ]
      },
      modules: process.env.NODE_ENV === 'test' ? 'commonjs' : false
    }],
    'stage-3',
    'react'
  ],
  plugins: [
    // make sure that 'transform-decorators' comes before 'transform-class-properties'
    'transform-decorators-legacy',
    'transform-class-properties',
    ['transform-runtime', { 'polyfill': false }],
    'transform-export-extensions'
  ],
  env: {
    test: {
      plugins: ['istanbul']
    }
  }
};
