'use strict';

import AuthController from '../controllers/auth';

export default function (router, passport) {

  let auth = new AuthController(passport);

  // Handle local authentication
  router.post('/auth', (req, res, next) => auth.local(req, res, next));

  // Handle the callback after facebook has authenticated the user
  router.get('/auth/facebook/callback', auth.facebook(), (req, res, next) => auth.authenticate(req, res, next));

  // Handle the callback after a facebook authentication error
  router.use('/auth/facebook/callback', (err, req, res, next) => auth.authenticateError(err, req, res, next));

  // Handle Facebook authentication request
  router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'email'
  }));

}