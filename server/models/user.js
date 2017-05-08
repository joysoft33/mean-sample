'use strict';

let settings = require('../utilities/settings');
let strings = require('../utilities/strings');
let mongoose = require('mongoose')
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

let UserSchema = new mongoose.Schema({
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
  isAdmin: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    require: true,
    select: false
  }
}, {
  timestamps: true
});

UserSchema.pre('save', function (next) {

  if (this.isModified('firstName')) {
    this.firstName = strings.capitalizeWords(this.firstName);
  }

  if (this.isModified('lastName')) {
    this.lastName = this.lastName.toUpperCase();
  }

  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    next();
  } else {
    // Generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) {
        next(err);
      } else {
        // Hash the password using our new salt
        bcrypt.hash(this.password, salt, (err, hash) => {
          if (err) {
            next(err);
          } else {
            // Override the cleartext password with the hashed one
            this.password = hash;
            next();
          }
        });
      }
    });
  }
});

UserSchema.pre('update', function (next) {

  var values = this._update.$set;

  if (values.firstName) {
    values.firstName = strings.capitalizeWords(values.firstName);
  }

  if (values.lastName) {
    values.lastName = values.lastName.toUpperCase();
  }

  if (!values.password) {
    next();
  } else {
    // Generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) {
        next(err);
      } else {
        // Hash the password using our new salt
        bcrypt.hash(values.password, salt, (err, hash) => {
          if (err) {
            next(err);
          } else {
            // Override the cleartext password with the hashed one
            values.password = hash;
            next();
          }
        });
      }
    });
  }
});

UserSchema.methods.validPassword = function (candidatePassword, next) {
  bcrypt.compare(candidatePassword, this.password, function (err, match) {
    if (err) {
      next(err);
    } else {
      next(null, match);
    }
  });
};

UserSchema.methods.generateJwt = function () {

  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.fullName(),
    exp: parseInt(expiry.getTime() / 1000),
  }, settings.jwtSecret);
};

UserSchema.methods.fullName = function () {
  return this.firstName + ' ' + this.lastName;
};

module.exports = mongoose.model('User', UserSchema);