'use strict';

const TokenService = require('../service/TokenService');

function AuthMiddleware(req, res, next) {
  let token = (req.body && req.body['authorization']) || (req.query && req.query['authorization']) || req.headers['authorization'];
  req.user = false;
  req.rawUser = false;
  if (token) {
    try {
      let auth = TokenService.decodeToken(token);
      if (auth) {
        auth.then((p) => {
          req.user = p.user;
          req.rawUser = p.rawUser;
          next();
        }, (err) => {
          next(err);
        })
      }
    } catch (err) {
      next(err);
    }
  } else {
    req.noAuth = true;
    next();
  }
}

module.exports = AuthMiddleware();
