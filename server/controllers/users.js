'use strict';

import User from '../models/user';

class UsersController {

  // Get all users filtered with queries string
  find(req, res, next, currentUser) {
    if (currentUser && currentUser.isAdmin) {
      User.find(req.query, (err, users) => {
        if (err)
          next(err);
        else
          res.json(users);
      });
    } else {
      res.status('401').send('Not authorized, your are not admin!');
    }
  }

  // Get a unique user by request param, this param need to be id
  findById(req, res, next, currentUser) {
    if (currentUser && (req.params.id == currentUser._id || currentUser.isAdmin)) {
      User.findById(req.params.id, (err, user) => {
        if (err)
          next(err);
        else
          res.json(user);
      });
    } else {
      res.status('401').send('Not authorized, your are not admin!');
    }
  }

  // Create a user with data from body request (req.body)
  create(req, res, next) {
    User.create(req.body, (err, user) => {
      if (err) {
        next(err);
      } else {
        res.json({
          token: user.generateJWT()
        });
      }
    });
  }

  // Update a user by request param, this param need to be id with data from body request (req.body)
  update(req, res, next, user) {
    if (currentUser && (req.params.id == currentUser._id || currentUser.isAdmin)) {
      User.update({
        _id: req.params.id
      }, req.body, (err, status) => {
        if (err) {
          next(err);
        } else {
          res.sendStatus(200);
        }
      });
    } else {
      res.status('401').send('Not authorized, your are not admin!');
    }
  }

  // Delete a unique user by request param, this param need to be id
  delete(req, res, next, currentUser) {
    if (currentUser && currentUser.isAdmin) {
      User.findByIdAndRemove(req.params.id, (err) => {
        res.sendStatus(200);
      });
    } else {
      res.status('401').send('Not authorized, your are not admin!');
    }
  }

}

export default UsersController