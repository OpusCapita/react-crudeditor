const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PORT = 7700;

// ███████████████████████████████████
// ███   WEBPACK INITIALIZATION    ███
// ███████████████████████████████████

const webpack = require('webpack');
const webpackDevConfig = require('../../webpack.config.babel');
const compiler = webpack(webpackDevConfig);

const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
  hot: true,
  stats: {
    colors: true
  }
});

app.use(webpackDevMiddleware);
app.use(require('webpack-hot-middleware')(compiler));

app.use(function (req, res, next) {
  console.info('===== [' + new Date().toUTCString() + '] ', req.originalUrl);
  next();
});

app.use(bodyParser.json());
require('./api')(app);

// ███████████████████████████████████████████████████████████████████████
// ███   index.html & bundle.js (must be the very last app.get(...))   ███
// ███████████████████████████████████████████████████████████████████████

app.get(`*/${webpackDevConfig.output.filename}`, function (req, res) {
  // Get the bundle.js from the fileSystem
  const htmlBuffer = webpackDevMiddleware.fileSystem.readFileSync(`${webpackDevConfig.output.path}/${webpackDevConfig.output.filename}`)
  res.send(htmlBuffer.toString())
});

app.get('*', function (req, res) {
  // Get the index.html from the fileSystem
  const htmlBuffer = webpackDevMiddleware.fileSystem.readFileSync(`${webpackDevConfig.output.path}/index.html`)
  res.send(htmlBuffer.toString())
});

let server = app.listen(PORT || 8081, function () {
  let host = server.address().address;
  let port = server.address().port;
  console.info(`Server listening at http://${host === '::' ? 'localhost' : host}:${port}`);
});
