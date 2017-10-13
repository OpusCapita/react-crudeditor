// const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PORT = 7700;
const FAKE_RESPONSE_TIMEOUT = 300; // In milliseconds. 0 for no timeout.

// ███████████████████████████████████
// ███   WEBPACK INITIALIZATION    ███
// ███████████████████████████████████

const webpack = require('webpack');
const webpackDevConfig = require('../../webpack.config.babel')('dev');
const compiler = webpack(webpackDevConfig);

const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
  stats: {
    colors: true
  }
});

app.set('etag', false);
app.use(webpackDevMiddleware);

app.use(function(req, res, next) {
  console.info('===== [' + new Date().toUTCString() + '] ', req.originalUrl);
  next();
});

// app.use('/styles', express.static(path.resolve(__dirname, '../../node_modules/@opuscapita/styles/dist/npm')));

app.use(bodyParser.json());

if (FAKE_RESPONSE_TIMEOUT) {
  app.use((req, res, next) => setTimeout(next, FAKE_RESPONSE_TIMEOUT));
}

require('./api')(app);
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

// ███████████████████████████████████████████████████████████████████████
// ███   index.html & bundle.js (must be the very last app.get(...))   ███
// ███████████████████████████████████████████████████████████████████████

app.get(`*/${webpackDevConfig.output.filename}`, function(req, res) {
  // Get the bundle.js from the fileSystem
  const htmlBuffer = webpackDevMiddleware.fileSystem.readFileSync(
    `${webpackDevConfig.output.path}/${webpackDevConfig.output.filename}`
  );

  res.send(htmlBuffer.toString())
});

app.get('*', function(req, res) {
  // Get the index.html from the fileSystem
  const htmlBuffer = webpackDevMiddleware.fileSystem.readFileSync(`${webpackDevConfig.output.path}/index.html`)
  res.send(htmlBuffer.toString())
});

const server = app.listen(PORT || 8081, function() {
  const host = server.address().address;
  const port = server.address().port;
  console.info(`Server listening at http://${host === '::' ? 'localhost' : host}:${port}`);
});
