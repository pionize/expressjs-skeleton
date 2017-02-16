'use strict';

const util = require('util');

/**
 * Default error
 *
 * @param err
 * @returns {Error}
 * @constructor
 */
function DefaultError(err) {
  return Error(err);
}

function RecordNotFound(err) {
  return Error(err);
}

function NotFoundError(message, status) {
  this.name = 'NotFoundErr';
  this.message = message;
  this.code = status || 404;
}
util.inherits(NotFoundError, Error);

function ValidationError(fields, status) {
  this.name = 'ValidationErr';
  this.message = 'Validation Error';
  this.fields = fields;
  this.code = status || 400;
}
util.inherits(ValidationError, Error);

module.exports = {
  ConfigurationError: DefaultError,
  DatabaseError: DefaultError,
  ValidationError: ValidationError
};
