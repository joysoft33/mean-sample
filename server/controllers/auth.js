'use strict';

import querystring from 'querystring';
import User from '../models/user';

const CLIENT_CALLBACK = '/#!/auth/callback';

/**
 * The authentication routes controller object class
 */
class AuthController {

  constructor(passport) {
    this.passport = passport;
  }

  /**
   * Authenticate user using our "LocalStrategy" in passport.js
   * Set a custom callback to send local authentication response
   * @param {object} req The request
   * @param {object} res The response
   * @param {requestCallback} next The next middleware function
   */
  local(req, res, next) {
    return this.passport.authenticate('local', {
      session: false
    },
    (err, user, info) => {
      if (err || !user) {
        res.status(403).json(err || info);
      } else {
        res.json({
          token: user.generateJWT()
        });
      }
    })(req, res, next);
  }

  /**
   * Authenticate user using our "FacebookStrategy" in passport.js
   * Terminate the Facebook authentication
   * @param {object} req The request
   * @param {object} res The response
   * @param {requestCallback} next The next middleware function
   */
  facebookCallback(req, res, next) {
    if (req.user) {
      // Build a fake user for generating the auth token
      let user = new User(req.user);
      let token = user.generateJWT();
      // Redirect to the client view
      res.redirect(CLIENT_CALLBACK + '/' + token);
    } else {
      facebookError(null, req, res, next);
    }
  }

  /**
   * Process Facebook authentication error
   * @param {string} err The error string
   * @param {object} req The request
   * @param {object} res The response
   * @param {requestCallback} next The next middleware function
   */
  facebookError(err, req, res, next) {
    if (err) {
      // Remove uneeded attributes
      delete err.status;
      delete err.stack;
    } else {
      err = {
        code: 0
      };
    }
    // Redirect to the client view
    res.redirect(CLIENT_CALLBACK + '?' + querystring.stringify(err));
  }
}

export default AuthController;