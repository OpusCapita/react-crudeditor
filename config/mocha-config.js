// required only by Mocha

// set node env

const JSDOM = require('jsdom').JSDOM;

process.env.NODE_ENV = 'test';

require('babel-register')(require('./babel-config')())

global.document = new JSDOM('<!doctype html><html><body></body></html>');
global.window = global.document.window;
global.document = window.document;
global.navigator = global.window.navigator;
global.self = global.window;
