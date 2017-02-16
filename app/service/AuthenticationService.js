'use strict';

const Promise = require('bluebird');
const md5 = require('md5');
const SaltLength = 9;

const config = require('./../lib/config');
const User = require('./../model/UserModel');

/**
 * Authentication Service
 *
 * @returns {{authenticate: authenticate, compareDigest: compareDigest}}
 * @constructor
 */
function AuthenticationService() {

  /**
   * Authenticate user, only returns the user ID upon success
   *
   * @param identifier
   * @param credentials
   * @returns {bluebird|exports|module.exports}
   */
  const authenticate = (identifier, credentials) => {
    let search = 'email';
    let predicate = {};
    predicate[search] = identifier;
    var auth = User.where(search, identifier).fetch();

    return new Promise(function(resolve, reject) {
      auth.then(function(p) {
          if (p) {
            let data = p.attributes;

            if (validateHash(credentials, data['password'])) {
              resolve(p);
            } else {
              reject(Error('Username atau password tidak cocok.'));
            }

          } else {
            reject(Error('Username belum terdaftar.'));
          }
        })
        .catch(function(e) {
          reject(e);
        });
    });
  };

  /**
   * Compare message and it's message digest
   *
   * @param message
   * @param digest
   * @returns {boolean}
   */
  const compareDigest = function(message, digest) {
    let hashed = md5(message);
    return hashed === digest;
  };

  const createHash = function(password) {
    let salt = generateSalt(SaltLength);
    let hash = md5(password + salt);
    return salt + hash;
  };

  const validateHash = function(password, hash) {
    let salt = hash.substr(0, SaltLength);
    let validHash = salt + md5(password + salt);
    return hash === validHash;
  };

  const generateSalt = function (len) {
    let set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
      setLen = set.length,
      salt = '';
    for (let i = 0; i < len; i++) {
      let p = Math.floor(Math.random() * setLen);
      salt += set[p];
    }
    return salt;
  };

  return {
    authenticate: authenticate,
    compareDigest: compareDigest,
    createHash: createHash,
    validateHash: validateHash,
  }
}

module.exports = AuthenticationService();