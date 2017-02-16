'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var knex = require('../../lib/db').knex;

function UniqueValidator(table, column, value, except, cb) {
  return new Promise(function(resolve, reject) {
    var builder = knex.count(column + ' as c')
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
      var c = parseInt(result[0]['c']);
      if (c > 0) {
        reject(Error('Already Exist'));
      } else {
        resolve(c);
      }
    });
  });
}

module.exports = UniqueValidator;
