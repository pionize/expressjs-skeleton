'use strict';

const autoIncrement = require('mongoose-auto-increment');
const mongoose = require('../lib/db');

var Schema = mongoose.Schema;


let UserModel = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: Date,
  updated_at: Date
});

UserModel.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

//implement mongo auto increment plugin
/*autoIncrement.initialize(mongoose.connection);
UserModel.plugin(autoIncrement.plugin, 'User');*/

module.exports = mongoose.model('User', UserModel);