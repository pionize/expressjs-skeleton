'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const inputAccessor = require('./app/middleware/InputAccessorMiddleware');
const corsMiddleware = require('./app/middleware/CorsMiddleware');
const validatorMiddleware = require('./app/middleware/ValidatorMiddleware');
const apiEndpoint = require('./app/api/ApiEndpoint');
const config = require('./app/lib/config');
const app = express();

app.use(bodyParser.json({
  limit: '5mb'
}));

app.use(bodyParser.urlencoded({
  extended: false,
  limit: '5mb'
}));

app.use(validatorMiddleware);
app.use(corsMiddleware);
app.use(inputAccessor);
app.use(apiEndpoint(express));

// handle 404 error
app.use((req, res, next) => {
  let err = new Error('Path Not Found');
  err.status = 404;
  next(err);
});

// handle server error
app.use((err, req, res, next) => {
  let statusCode = err.code;
  if (statusCode >= 100 && statusCode < 600)
    res.status(statusCode);
  else
    res.status(500);
  let message = err.message;
  delete err.message;
  delete err.code;
  res.json({
    status: false,
    message: message,
    data: config.isDevelopment() ? err : {}
  });
});

module.exports = app;
