'use strict';

let User = require('../models/user');

class UsersController {

  // Get all users filtered with queries string
  find(req, res, next) {
    User.find(req.query, (err, users) => {
      if (err)
        next(err);
      else
        res.json(users);
    });
  }

  // Get a unique user by request param, this param need to be id
  findById(req, res, next) {
    User.findById(req.params.id, (err, user) => {
      if (err)
        next(err);
      else
        res.json(user);
    });
  }

  // Create a user with data from body request (req.body)
  create(req, res, next) {
    User.create(req.body, (err, user) => {
      if (err) {
        next(err);
      } else {
        // Don't return the password field!!
        var o = user.toObject();
        delete o.password;
        res.send(o);
      }
    });
  }

  // Update a user by request param, this param need to be id with data from body request (req.body)
  update(req, res, next) {
    User.update({
      _id: req.params.id
    }, req.body, (err, status) => {
      if (err) {
        next(err);
      } else {
        res.sendStatus(200);
      }
    });
  }

  // Delete a unique user by request param, this param need to be id
  delete(req, res, next) {
    User.findByIdAndRemove(req.params.id, (err) => {
      res.sendStatus(200)
    });
  }
}

module.exports = UsersController