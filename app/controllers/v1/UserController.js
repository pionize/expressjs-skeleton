'use strict';

const md5 = require('md5');
const moment = require('moment');
const config = require('./../../lib/config');
const JWTService = require('../../service/JWTService');
const AuthenticationService = require('../../service/AuthenticationService');
const UserService = require('../../service/UserService');

const getUserObj = (req) => {
  return {
    name: req.input('name', null),
    password: req.input('password', null),
    email: req.input('email', null),
  }
};

/**
 * User Controller
 *
 * @constructor
 */
function UserController() {
    /**
     * Login
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise|*}
     */
    const login = (req, res, next) => {
        let username = req.input('username');
        let password = req.input('password');

        var authUser = AuthenticationService.authenticate(username, password);

        return authUser
            .then((user) => {
                let userId = user.get('user_id');
                var payload = {
                    iss: req.hostname,
                    sub: userId,
                    iat: moment().unix(),
                    jti: 'user'
                };
                req.data = user;
                req.token = JWTService.encode(payload);
                return UserService.update(userId, {updated: moment().format('YYYY-MM-DD HH:mm')});
            }, function (err) {
                err.code = 401;
                throw err;
            })
            .then(() => {
                return next();
            })
          .catch(err => {
            return next(err);
          });
    };

    /**
     * Create user
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise|*}
     */
      
    const create = (req, res, next) => {
      let userObj = getUserObj(req);

      return UserService.create(userObj)
        .then((user) => {
            if (user) {
              let id = user.get('user_id');
              var payload = {
                  iss: req.hostname,
                  sub: id,
                  iat: moment().unix(),
                  jti: 'user'
              };

              let token = JWTService.encode(payload);

              let tmp = JSON.stringify(user);
              let userObj = JSON.parse(tmp);
              userObj.token = token;
              req.data = userObj;
              return next();
            }
        }, (err) => {
            err.code = 500;
            throw err;
        })
      .catch(err => {
        return next(err);
      });
    };

    const detail = (req, res, next) => {
      let id = req.input('id');

      return UserService.byId(id)
        .then(user => {
          if (user) {
            req.data = user;
            return next();
          }
        })
        .catch(err => {
          return next(err);
        });
    };

    const update = (req, res, next) => {
      let id = req.input('id');
      let userObj = getUserObj(req);
      return UserService.update(id, userObj)
        .then((user) => {
            req.data = user;
            return next();
        })
        .catch(err => {
          return next(err);
        });
    };


    const list = (req, res, next) => {
      let params = {
        query: req.query.query,
        email: req.input('email'),
        pageSize: req.input('limit', 10),
        page: req.input('page', 1),
        sort: req.input('sort', ''),
      };
      return UserService.list(params)
        .then((users) => {
          if (users) {
            req.pagination = users.pagination;
            req.data = users.toArray();
            return next();
          }
        });
    };
  
    return {
      login: login,
      create: create,
      detail: detail,
      update: update,
      list: list
    };
}

module.exports = UserController();
