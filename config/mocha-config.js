const babelConfig = require('./babel-config');
require('babel-register')(babelConfig);

const JSDOM = require('jsdom').JSDOM;
global.document = new JSDOM('<!doctype html><html><body></body></html>');
global.window = global.document.window;
global.document = window.document;
global.navigator = global.window.navigator;
global.self = global.window;
