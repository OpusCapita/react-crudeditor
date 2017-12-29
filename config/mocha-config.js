// required only by Mocha

// set node env

const JSDOM = require('jsdom').JSDOM;

process.env.NODE_ENV = 'test';

require('babel-register')({
  "presets": [
    ["env", {
      "targets": {
        "browsers": ["last 2 versions", "ie >= 11", "not ie <= 10", "safari >= 7", "Firefox ESR"]
      }
    }],
    "react"
  ],
  "plugins": [
    "istanbul",
    "transform-decorators-legacy",
    "transform-class-properties",
    "transform-runtime",
    "transform-object-rest-spread"
  ]
})

global.document = new JSDOM('<!doctype html><html><body></body></html>');
global.window = global.document.window;
global.document = window.document;
global.navigator = global.window.navigator;
global.self = global.window
