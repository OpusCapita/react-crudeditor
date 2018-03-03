module.exports = _ => {
  const mode = process.env.NODE_ENV;

  const envPresetConfig = {
    targets: {
      browsers: [
        'chrome >= 64',
        'firefox ESR',
        'ie >= 11',
        'safari >= 11'
      ]
    }
  };

  if (mode !== 'test') {
    envPresetConfig.modules = false;
  }

  return {
    babelrc: false,
    presets: [
      ['env', envPresetConfig],
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
  };
}
