#!/bin/bash

rm -rf public &&
node node_modules/webpack/bin/webpack.js --config ./config/webpack.config.babel.js