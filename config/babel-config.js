module.exports = {
  babelrc: false,
  presets: [
    ['env', {
      // TODO: remove "targets" key after babel 7.0 is out
      // because external config in package.json or browserslist will be supported in 7.0
      // For more details see
      // https://github.com/browserslist/browserslist
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
