'use strict';

let mongoose = require('mongoose')

module.exports = mongoose.model('User', new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true
  },
  firstName: {
    type: String,
    require: true
  },
  lastName: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
}))