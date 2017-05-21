'use strict';

import AuthController from '../controllers/auth';

export default (router, passport) => {

  let auth = new AuthController(passport);

  router.post('/auth', (req, res, next) => {
    return auth.local(req, res, next, passport);
  });

  router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'email'
  }));

  // Handle the callback after facebook has authenticated the user
  router.get('/auth/facebook/callback', auth.facebook(passport), (req, res, next) => {
    return auth.authenticate(req, res, next);
  });

  // Handle the callback after a facebook authentication error
  router.use('/auth/facebook/callback', (err, req, res, next) => {
    return auth.authenticateError(err, req, res, next);
  });
}