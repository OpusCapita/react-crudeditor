#!/bin/bash

rm -rf .gh-pages-tmp &&
node node_modules/@opuscapita/react-showroom-server/src/bin/showroom-scan.js src/demo/client/showroom &&
node node_modules/webpack/bin/webpack.js --config config/webpack.config.showroom.js
