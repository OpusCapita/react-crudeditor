#!/bin/sh

rm -rf .gh-pages-tmp &&
node node_modules/webpack/bin/webpack.js --config ./scripts/gh-pages/webpack.config.js &&
cp public/index.html .gh-pages-tmp