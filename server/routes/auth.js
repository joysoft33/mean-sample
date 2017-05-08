'use strict';

let AuthController = require('../controllers/auth');

module.exports = (app, passport) => {

  let auth = new AuthController(passport);

  app.post('/auth', (req, res, next) => {
    return auth.local(req, res, next, passport);
  });

  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'email'
  }))

  // Handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback', auth.facebook(passport), (req, res, next) => {
    return auth.authenticate(req, res, next);
  });
}