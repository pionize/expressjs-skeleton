'use strict';

var config = require('./config');

const mongoose = require('mongoose');
const Promise = require('bluebird');

const mongoConfig = config.db();
const connection = mongoConfig.connection+ mongoConfig.database;

mongoose.connect(connection);
mongoose.Promise = Promise;

module.exports = mongoose;
