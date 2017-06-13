'use strict';

import AuthController from '../controllers/auth';

/**
 * Configure and export the authentication routes.
 * @param {object} router The express router object
 * @param {object} passport the passport object
 */
export default function (router, passport) {

  let auth = new AuthController(passport);

  // Handle local authentication
  router.post('/auth', (req, res, next) => auth.local(req, res, next));

  // Handle Facebook authentication request
  router.get('/auth/facebook', passport.authenticate('facebook', {
    session: false,
    scope: 'email'
  }));

  // Handle the callback after facebook has authenticated the user
  router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    session: false
  }), (req, res, next) => auth.facebookCallback(req, res, next));

  // Handle the callback after a facebook authentication error
  router.use('/auth/facebook/callback', (err, req, res, next) => auth.facebookError(err, req, res, next));
}