'use strict';
const config = require('../lib/config');
const Promise = require('bluebird');
const moment = require('moment');
const knex = Promise.promisifyAll(require('knex')(config.db()));


function UserValidator() {
    function create(req, res, next) {

        req.assert('name').notEmpty().withMessage('Nama tidak boleh kosong.').matches(/[a-zA-Z ]{3,50}/).withMessage('Nama minimal 3 huruf dan harus berupa alfabet.');
        req.assert('password').notEmpty().withMessage('Password tidak boleh kosong.');

        req.asyncValidationErrors(true).catch((errors) => {
            errors.code = 400;
            next(errors);
        }).then(() => {
            next();
        });
    }

    function update(req, res, next) {
        req.assert('name').optional().matches(/[a-zA-Z ]{3,50}/).withMessage('Nama tidak boleh kosong, minimal 3 huruf dan harus berupa alfabet.');
        req.assert('password').optional().optional().withMessage('Password tidak boleh kosong.');
        req.asyncValidationErrors(true).catch((errors) => {
            errors.code = 400;
            next(errors);
        }).then(() => {
            next();
        });
    }


    function list(req, res, next) {
        req.assert('limit').optional().isInt().gte(0).withMessage('Parameter limit harus berupa angka dan lebih besar dari 0.');
        req.assert('page').optional().isInt().gte(1).withMessage('Parameter page harus berupa angka dan lebih besar dari 0');

        var errors = req.validationErrors(true);
        if (errors) {
            errors.code = 400;
            errors.message = 'Validation Error';
            next(errors);
        } else {
            next();
        }
    }

    function status(req, res, next) {
        let loggedUser = req.user;
        if (loggedUser.status != 'active') {
            let err = Error('User belum aktif.');
            err.code = 401;
            next(err);
        } else {
            next();
        }
    }

    function login(req, res, next) {
        req.assert('name').notEmpty().withMessage('Username kosong.');
        req.assert('password').notEmpty().withMessage('Password kosong.');

        req.sanitize('name').trim();
        req.sanitize('password').trim();

        var errors = req.validationErrors(true);

        if (errors) {
            errors.code = 400;
            errors.message = 'Login gagal';
            next(errors);
        } else {
            next();
        }
    }

  function detail(req, res, next) {
    next();
  }
    return {
        create: create,
        update: update,
        list: list,
        status: status,
        login: login,
        detail: detail
    }
}

module.exports = UserValidator();