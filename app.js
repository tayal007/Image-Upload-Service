var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require("./logger");
var expressWinston = require('express-winston');
var winston = require('winston');
var projectEnv = require('./config/projectEnv').projectEnv;
var accessLogsfile = projectEnv.accessLogs.filename;

var indexRouter = require('./routes/index');

var app = express();

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
};
app.use(allowCrossDomain);

app.use(expressWinston.logger({
  transports: [
    new winston.transports.DailyRotateFile({
      name : 'tps-access-file',
      datePattern: '.yyyy-MM-dd',
      filename: accessLogsfile,
      handleExceptions: true,
      json: true,
      colorize: false
    })
  ],
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  expressFormat: true, // Use the default Express/morgan request formatting, with the same colors. Enabling this will override any msg and colorStatus if true. Will only output colors on transports with colorize set to true
  colorStatus: true // Color the status code, using the Express/morgan color palette (default green, 3XX cyan, 4XX yellow, 5XX red). Will not be recognized if expressFormat is true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(express.json({ limit: '1mb'}));
app.use(express.urlencoded({ extended: false, limit: '1mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// error handler
app.use(function(err, req, res, next) {
  var errorObj={};
  errorObj['err_name'] = "APP_FAILURE";
  errorObj['err_stk'] = err.stack;
  logger.error(JSON.stringify(errorObj));
  if(err.message === 'request entity too large') {
      res.status(400).send(err);
  } else {
      res.status(500).send(err);
      res.end();
  }
});

module.exports = app;
