'use strict';

var _ = require('lodash');
var xss = require('xss');

function InputAccessorMiddleware(req, res, next) {
  req.input = function(path, defaultValue) {

    if (_.has(req.params, path)) {
      return xss(_.get(req.params, path));
    } else if (_.has(req.query, path)) {
      return xss(_.get(req.query, path));
    } else if (_.has(req.body, path)) {
      return xss(_.get(req.body, path));
    } else if (_.has(req, path)) {
      return _.get(req, path);
    }

    return defaultValue;
  };

  next();
}

module.exports = InputAccessorMiddleware;
