'use strict';

import settings from '../utilities/settings';
import strings from '../utilities/strings';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// For password encryption
const SALT_WORK_FACTOR = 10;

/**
 * Build the user schema
 */
let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  facebook: {
    id: String,
    token: String,
    photo: String
  }
}, {
  timestamps: true
});

/**
 * Sanitize the user fields before creating object in db
 */
UserSchema.pre('save', function (next) {

  if (this.isModified('firstName')) {
    this.firstName = strings.capitalizeWords(this.firstName);
  }

  if (this.isModified('lastName')) {
    this.lastName = this.lastName.toUpperCase();
  }

  // Only hash the password if it has been modified (or is new)
  if (this.isModified('password')) {
    bcrypt.hash(this.password, SALT_WORK_FACTOR).then((hash) => {
      // Override the cleartext password with the hashed one
      this.password = hash;
      next();
    })
    .catch((err) => {
      next(err);
    });
  } else {
    next();
  }
});

/**
 * Sanitize the modified user fields before storing in db
 */
UserSchema.pre('update', function (next) {

  var values = this._update.$set;

  if (values.firstName) {
    values.firstName = strings.capitalizeWords(values.firstName);
  }

  if (values.lastName) {
    values.lastName = values.lastName.toUpperCase();
  }

  if (values.password) {
    bcrypt.hash(values.password, SALT_WORK_FACTOR).then((hash) => {
      // Override the cleartext password with the hashed one
      values.password = hash;
      next();
    })
    .catch((err) => {
      next(err);
    });
  } else {
    next();
  }
});

/**
 * Compare the given password with the db encrypted one
 */
UserSchema.methods.validPassword = function (candidatePassword, next) {
  bcrypt.compare(candidatePassword, this.password).then((match) => {
    next(null, match);
  })
  .catch((err) => {
    next(err);
  });
};

/**
 * Build an encrypted token from the current user
 */
UserSchema.methods.generateJWT = function () {

  let env = settings();

  return jwt.sign({
      _id: this._id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      isAdmin: this.isAdmin
    },
    env.jwtSecret, {
      expiresIn: '1h'
    });
};

/**
 * Return the full user name
 */
UserSchema.methods.fullName = function () {
  return this.firstName + ' ' + this.lastName;
};

/**
 * Create and export the user model from the built user schema
 */
export default mongoose.model('User', UserSchema);