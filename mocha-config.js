// required only by Mocha

// set node evn
process.env.NODE_ENV = 'test';

require('babel-register')({
  "presets": ["es2015", "stage-2", "react"],
  "plugins": ["istanbul"]
})
