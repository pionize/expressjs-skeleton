'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var knex = require('../../lib/db').knex;

function ExistValidator(table, column, value, except, cb) {
  return new Promise(function(resolve, reject) {
    var builder = knex.first('*')
      .from(table)
      .where(function() {
        this.where(column, value);
      });

    if (except) {
      _.each(except, function(value, key) {
        builder.andWhereNot(key, value);
      });
    }

    if (cb) {
      cb(builder, resolve, reject);
    }

    builder.then(function(result) {
      if (result) {
        resolve(result);
      } else {
        reject(Error('Data not exist.'));
      }
    });
  });
}

module.exports = ExistValidator;
