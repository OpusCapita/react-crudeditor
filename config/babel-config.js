const getBabelConfig = _ => {
  const mode = process.env.NODE_ENV;

  const envPresetConfig = {
    "targets": {
      "browsers": ["last 2 versions", "ie >= 11", "safari >= 7", "Firefox ESR"]
    }
  }

  const plugins = [
    "transform-decorators-legacy",
    "transform-class-properties",
    "transform-runtime",
    "transform-object-rest-spread"
  ]

  if (mode !== 'test') {
    envPresetConfig.modules = false
  }

  const config = {
    babelrc: false,
    presets: [
      ["env", envPresetConfig],
      "react"
    ],
    plugins,
    env: {
      test: {
        plugins: ["istanbul"]
      }
    },
  }

  return config
}

module.exports = getBabelConfig;
