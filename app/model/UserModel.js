'use strict';

const bookshelf = require('../lib/db');
const config = require('../lib/config');
const moment = require('moment');
const AuthService = require('./../service/AuthenticationService');

let UserModel = bookshelf.Model.extend({
  tableName: 'user',
  idAttribute: 'user_id'
});

UserModel.prototype.validate = function(model, attrs, options) {
  if (this.hasChanged('password')) {
    attrs.password = AuthService.createHash(attrs.password);
  }
};

UserModel.prototype.verifyPassword = function(password) {
  return AuthService.validateHash(password, this.get('password'));
};

UserModel.prototype.serialize = function() {
  let obj = {
    id: this.get('user_id'),
    name : this.get('name'),
    created: moment(this.get('created')).format('YYYY-MM-DD HH:mm')
  };
  return obj;
};

module.exports = UserModel;