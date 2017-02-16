'use strict';
const expressValidator = require('express-validator');
const _ = require('lodash');
const existValidator = require('../validators/helpers/ExistValidator');
const uniqueValidator = require('../validators/helpers/UniqueValidator');
const PhoneNumberSanitizer = require('../validators/sanitizers/PhoneNumberSanitizer');
const Promise = require('bluebird');
const validator = require('validator');
const moment = require('moment');

module.exports = expressValidator({
  customValidators: {
    isArray: (value) => {
      return Array.isArray(value);
    },
    notEmptyArray: (value) => {
      if (!Array.isArray(value)) {
        return false;
      }

      return value.length != 0;
    },
    gte: (value, num) => {
      return value >= num;
    },
    lte: (value, num) => {
      return value <= num;
    },
    between: (max, min, num) => {
      return (num <= max) && (num >= min);
    },
    dateValidate: (input, format) => {
      return moment(input, format).isValid();
    },
    strictDateValidate: (input, format, nullable) => {
      if (nullable && !input) {
        return true;
      }
      return moment(input, format, true).isValid();
    },
    isExist: (value, table, column, except, cb) => {
      return existValidator(table, column, value, except, cb);
    },
    isExistArray: (value, table, column, except, cb) => {
      if (!Array.isArray(value)) {
        value = [value];
      }
      let checks = [];
      _(value).forEach(function(val) {
        checks.push(existValidator(table, column, val, except, cb));
      });
      return Promise.all(checks);
    },
    isUnique: (value, table, column, except, cb) => {
      return uniqueValidator(table, column, value, except, cb);
    },
    isBase64: (input) => {
      if (!input) return true;
      let base64Image = input;
      if (input.indexOf('image/') > -1) {
        base64Image = base64Image.split(',')[1];
      }
      let regex = new RegExp(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/);
      return regex.test(base64Image);
    },
    callbackCheck: (value, service) => {
      return service(value);
    },
    notEmpty: (input) => {
      if (input !== undefined ) {
        input = String(input);
        input = input.trim();
        return validator.isLength(input, {
          min: 1
        });
      } else {
        return false;
      }
    },
    isURL: (url) => {
      if (url == '') {
        return true;
      }
      if (!url || url.length >= 2083 || /\s/.test(url)) {
        return false;
      }
      if (url.indexOf('mailto:') === 0) {
        return false;
      }
      const options = {
        protocols: ['http', 'https', 'ftp'],
        require_tld: true,
        require_protocol: false,
        require_valid_protocol: true,
        allow_underscores: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false,
      };
      let protocol, auth, host, hostname, port, port_str, split;

      split = url.split('#');
      url = split.shift();

      split = url.split('?');
      url = split.shift();

      split = url.split('://');
      if (split.length > 1) {
        protocol = split.shift();
        if (options.require_valid_protocol && options.protocols.indexOf(protocol) === -1) {
          return false;
        }
      } else if (options.require_protocol) {
        return false;
      } else if (options.allow_protocol_relative_urls && url.substr(0, 2) === '//') {
        split[0] = url.substr(2);
      }
      url = split.join('://');

      split = url.split('/');
      url = split.shift();
      split = url.split('@');
      if (split.length > 1) {
        auth = split.shift();
        if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
          return false;
        }
      }
      hostname = split.join('@');
      split = hostname.split(':');
      host = split.shift();
      if (split.length) {
        port_str = split.join(':');
        port = parseInt(port_str, 10);
        if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
          return false;
        }
      }
      if (!validator.isIP(host) && !validator.isFQDN(host, options) &&
        host !== 'localhost') {
        return false;
      }
      if (options.host_whitelist && options.host_whitelist.indexOf(host) === -1) {
        return false;
      }
      if (options.host_blacklist && options.host_blacklist.indexOf(host) !== -1) {
        return false;
      }
      return true;
    }
  },
  customSanitizers: {
    orderSanitizer: function(value) {
      return OrderIDSanitizer.decode(value);
    },
    phoneSanitizer: function(value) {
      return PhoneNumberSanitizer(value);
    },
    rupiahSanitizer: function(value) {
      return RupiahSanitizer.clear(value);
    },
    toWebsite: function(value) {
      if (!value || value == '') {
        return '';
      }
      if (!value.startsWith('http://') && !value.startsWith('https://')) {
        return 'http://' + value;
      }
      return value;
    }
  },
  errorFormatter: (param, msg, value) => {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      message: msg,
      value: value
    };
  }
});