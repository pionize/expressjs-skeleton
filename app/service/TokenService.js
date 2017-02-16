'use strict';

const Promise = require('bluebird');
const UserService = require('./UserService');
const JwtService = require('./JWTService');
const moment = require('moment');


function TokenService() {
  function decodeToken(token) {
    try {
      token = token.replace('Bearer ', '');
      let decoded = JwtService.decode(token);
      if (decoded.exp && (decoded.exp <= Date.now())) {
        let error = Error('Token telah kadaluarsa, silahkan login kembali.');
        error.code = 400;
        throw error;
      } else {
        // should check if `decoded.sub` is present?
        let userId = decoded.sub;

        let type = decoded.jti;
        // check if token is expired
        return new Promise(function(resolve, reject) {
          UserService.byId(userId)
            .then(function(p) {
              if (p) {
                let user = p.toJSON();
                resolve({
                  user: user,
                });
              } else {
                let error = new Error();
                error.code = 500;
                error.message = 'Tidak dapat mengambil data user.';
                reject(error);
              }
            }, function(error) {
              error.code = 500;
              error.message = 'Tidak dapat mengambil data user.';
              reject(error);
            });
        });
      }

    } catch (err) {
      let error = Error('Tidak dapat memvalidasi akses token.');
      error.code = 400;
      throw error;
    }
  }
  return {
    decodeToken: decodeToken
  }
}

module.exports = TokenService();