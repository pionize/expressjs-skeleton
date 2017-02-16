'use strict';

const Promise = require('bluebird');
const md5 = require('md5');
const _ = require('lodash');
const moment = require('moment');
const config = require('./../lib/config');
const AuthenticationService = require('./AuthenticationService');
const UserModel = require('./../model/UserModel');

/**
 * UserService Service
 *
 * @returns {{byId: byId, create: create, update: update, list: list}}
 * @constructor
 */
function UserService() {

  /**
   *
   * @param id
   */
  const byId = (id) => {
    return new Promise((resolve, reject) => {
      UserModel.findById(id)
        .then(u => {
          if (u) {
            resolve(u);
          } else {
            let err = new Error('User tidak ditemukan');
            reject(err);
          }
        })
        .catch(err => {
          reject(new Error('User tidak ditemukan'));
        })
    });
  };

  const create = (obj) => {
    let data = _.clone(_.omitBy(obj, _.isNil));
    data.password = AuthenticationService.createHash(data.password);

    return new Promise((resolve, reject) => {
      const user = new UserModel(data);
      user.save()
        .then(u => {
          resolve(u);
        }, err => {
          reject(err);
        })
    });
  };

  const update = (id, obj) => {
    let data = _.clone(_.omitBy(obj, _.isNil));
    if (data.password) {
      data.password = AuthenticationService.createHash(data.password);
    }

    return new Promise((resolve, reject) => {
      UserModel.findById(id)
        .then(u => {
          _.forEach(data, function(value, key) {
            u[key] = value;
          });

          return u.save();
        })
        .then(u => {
          resolve(u);
        })
        .catch(err => {
          reject(err);
        })
    });
  };

  //TODO: support mongodb
  const list = (params) => {

  };

  return {
    byId: byId,
    create: create,
    update: update,
    list: list,
  }

}

module.exports = UserService();
