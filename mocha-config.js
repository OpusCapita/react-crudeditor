// required only by Mocha

// set node evn
process.env.NODE_ENV = 'test';

require('babel-register')({
  "presets": ["es2015", "es2016", "es2017", "stage-0", "react"],
  "plugins": ["istanbul"]
})
