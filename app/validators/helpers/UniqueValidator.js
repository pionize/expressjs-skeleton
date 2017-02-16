'use strict';

var _ = require('lodash');
var Promise = require('bluebird');

//TODO: convert to mongodb version
function UniqueValidator(table, column, value, except, cb) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

module.exports = UniqueValidator;
