'use strict';

let UsersController = require('../controllers/users');

module.exports = (app, authCheck) => {
  
  let ctrl = new UsersController();

  // Use authCheck as middleware, it will check JWT token
  // and if JWT is ok, then it will set req.user (by default) in which we will find our payload information
  // If JWT isn't ok, it will send back an unauthorized error and prevent user from accessing this url
  // So, it checks if user is at least logged in (otherwise JWT token shouldn't be set / be right)

  app.get('/users', authCheck, function (req, res, next) {
    return ctrl.find(req, res, next, req.user);
  });

  app.get('/users/:id', authCheck, function (req, res, next) {
    return ctrl.findById(req, res, next, req.user);
  });

  app.post('/users', function (req, res, next) {
    return ctrl.create(req, res, next);
  });

  app.put('/users/:id', function (req, res, next) {
    return ctrl.update(req, res, next, req.user);
  });

  app.delete('/users/:id', function (req, res, next) {
    return ctrl.delete(req, res, next, req.user);
  });

};