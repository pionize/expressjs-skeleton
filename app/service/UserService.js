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
    let identifier = 'user_id';
    return new Promise((resolve, reject) => {
      UserModel.where(identifier, id).fetch().then(function(user) {
        if (user) {
          resolve(user);
        } else {
          let err = Error('Data tidak ditemukan');
          reject(err);
        }
      }).catch(function(err) {
        reject(err);
      });
    });
  };

  const create = (obj) => {
    let data = _.clone(_.omitBy(obj, _.isNil));
    data.created = moment().format('YYYY-MM-DD HH:mm');
    data.updated = moment().format('YYYY-MM-DD HH:mm');
    data.password = AuthenticationService.createHash(data.password);

    return new Promise((resolve, reject) => {
      new UserModel(data).save().then((result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    });
  };

  const update = (id, obj) => {
    let data = _.clone(_.omitBy(obj, _.isNil));
    data.updated = moment().format('YYYY-MM-DD HH:mm');
    if (data.password) {
      data.password = AuthenticationService.createHash(data.password);
    }

    return new Promise((resolve, reject) => {
      new UserModel({user_id : id}).save(data, {patch: true}).then((result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    });
  };

  //TODO: support order/sort
  const list = (params) => {
    var paramsObj = _.clone(_.pickBy(params, _.identity));

    delete paramsObj.page;
    delete paramsObj.pageSize;
    const allowedSort = ['name', 'id', 'created', 'updated'];

    const allowedSortType = ['asc', 'desc'];
    let sortKey = 'id';
    let sortType = 'desc';
    if (paramsObj.sort) {
      const tmp = paramsObj.sort.split(':');
      sortKey = paramsObj.sort;
      sortType = 'desc';
      if (tmp.length > 1) {
        sortKey = tmp[0];
        sortType = tmp[1].toLowerCase();
        if (allowedSortType.indexOf(sortType) < 0) sortType = 'desc';
      } else {
        sortType = 'desc';
      }
      if (allowedSort.indexOf(sortKey) < 0) sortKey = 'id';
    }
    delete paramsObj.sort;

    let queryParams = paramsObj.query;
    delete paramsObj.query;

    const created = paramsObj.created;
    delete paramsObj.created;

    return new Promise((resolve, reject) => {
      let query = UserModel.query(function(qb) {
        if (params.query) {
          qb.where('name', 'LIKE', queryParams+ '%');
          qb.orWhere('email', 'LIKE', queryParams+ '%');
        }
      });
        query.where(paramsObj)
        .orderBy(sortKey, sortType)
        .fetchPage({
          pageSize: params.pageSize,
          page: params.page
        })
        .then((d) => {
          resolve(d);
        });
    })
  };

  return {
    byId: byId,
    create: create,
    update: update,
    list: list,
  }

}

module.exports = UserService();
