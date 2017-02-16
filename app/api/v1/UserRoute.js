'use strict';

const express = require('express');
const router = express.Router();

const userValidator = require('../../validators/UserValidator');
const userController = require('../../controllers/v1/UserController');
const serviceResponse = require('../../formatter/v1/ServiceResponse');

router.get('/:id', userValidator.detail, userController.detail, serviceResponse);

router.post('/login', userValidator.login, userController.login, serviceResponse);

router.post('/', userValidator.create, userController.create,  serviceResponse);

router.put('/:id', userValidator.update, userController.update, serviceResponse);

module.exports = router;
