'use strict';

import querystring from 'querystring';
import User from '../models/user';

class AuthController {

  // Authenticate user using our "LocalStrategy" in passport.js
  local(passport, req, res, next) {
    // Give passport a custom callback in order to be able to manage the request return code/token
    return passport.authenticate('local', (err, user, info) => {
      if (err || !user) {
        res.status(401).json(err || info || 'Incorrect user email or password');
      } else {
        res.json({
          token: user.generateJWT()
        });
      }
    })(req, res, next);
  }

  // Authenticate user using our "FacebookStrategy" in passport.js
  // Terminate a Facebook authentication
  authenticate(req, res, next) {
    if (req.user) {
      // Build a fake user for generating the auth token
      let user = new User(req.user);
      let token = user.generateJWT();
      // Redirect to the client view
      res.redirect('/#!/auth/callback/' + token);
    } else {
      authenticateError(null, req, res, next);
    }
  }

  authenticateError(err, req, res, next) {
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
    res.redirect('/#!/auth/callback?' + querystring.stringify(err));
  }
}

export default AuthController;