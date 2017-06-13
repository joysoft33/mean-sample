'use strict';

import User from '../models/user';

/**
 * The user routes controller object class
 */
class UsersController {

  /**
   * Get all users filtered with queries string
   * @param {object} req The request
   * @param {object} res The response
   * @param {requestCallback} next The next middleware function
   * @param {object} currentUser The requester
   */
  find(req, res, next, currentUser) {
    if (currentUser && currentUser.isAdmin) {
      User.find(req.query, (err, users) => {
        if (err) {
          next(err);
        } else {
          res.json(users);
        }
      });
    } else {
      errorNotAdmin(res);
    }
  }

  /**
   * Get a unique user by request param, this param need to be id
   * @param {object} req The request
   * @param {object} res The response
   * @param {requestCallback} next The next middleware function
   * @param {object} currentUser The requester
   */
  findById(req, res, next, currentUser) {
    if (currentUser && (req.params.id == currentUser._id || currentUser.isAdmin)) {
      User.findById(req.params.id, (err, user) => {
        if (err) {
          next(err);
        } else {
          res.json(user);
        }
      });
    } else {
      errorNotAdmin(res);
    }
  }

  /**
   * Create a user with data from body request (req.body)
   * @param {object} req The request
   * @param {object} res The response
   * @param {requestCallback} next The next middleware function
   */
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

  /**
   * Update a user by request param, this param need to be id with data from body request (req.body)
   * @param {object} req The request
   * @param {object} res The response
   * @param {requestCallback} next The next middleware function
   * @param {object} currentUser The requester
   */
  update(req, res, next, currentUser) {
    if (currentUser && (req.params.id == currentUser._id || currentUser.isAdmin)) {
      User.findOneAndUpdate(req.params.id, req.body, {
        new: true,
      },
      (err, user) => {
        if (err) {
          next(err);
        } else {
          res.json(user);
        }
      });
    } else {
      errorNotAdmin(res);
    }
  }

  /**
   * Delete a unique user by request param, this param need to be id
   * @param {object} req The request
   * @param {object} res The response
   * @param {requestCallback} next The next middleware function
   * @param {object} currentUser The requester
   */
  delete(req, res, next, currentUser) {
    if (currentUser && currentUser.isAdmin) {
      User.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
          next(err);
        } else {
          res.sendStatus(200);
        }
      });
    } else {
      errorNotAdmin(res);
    }
  }

  /**
   * Send a 401 error response
   * @param {object} res The response
   */
  errorNotAdmin(res) {
    res.status('401').send('Not authorized, not admin.');
  }
}

export default UsersController;