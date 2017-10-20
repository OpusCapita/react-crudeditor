// required only by Mocha

// set node evn

const JSDOM = require('jsdom').JSDOM;

process.env.NODE_ENV = 'test';

require('babel-register')({
  "presets": ["es2015", "es2016", "es2017", "stage-0", "react"],
  "plugins": ["istanbul"]
})

global.document = new JSDOM('<!doctype html><html><body></body></html>');
global.window = global.document.window;
global.document = window.document;
global.navigator = global.window.navigator;
global.self = global.window
