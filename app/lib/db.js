'use strict';

var config = require('./config');
var knex = require('knex')(config.db());

const bookshelf = require('bookshelf')(knex);
bookshelf.plugin('pagination');

module.exports = bookshelf;
