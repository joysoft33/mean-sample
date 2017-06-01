'use strict';

import UsersController from '../controllers/users';

export default (router, authCheck) => {
  
  let ctrl = new UsersController();

  // Use authCheck as middleware, it will check JWT token
  // and if JWT is ok, then it will set req.user (by default) in which we will find our payload information
  // If JWT isn't ok, it will send back an unauthorized error and prevent user from accessing this url
  // So, it checks if user is at least logged in (otherwise JWT token shouldn't be set / be right)

  router.get('/users', authCheck, function (req, res, next) {
    return ctrl.find(req, res, next, req.user);
  });

  router.get('/users/:id', authCheck, function (req, res, next) {
    return ctrl.findById(req, res, next, req.user);
  });

  router.post('/users', function (req, res, next) {
    return ctrl.create(req, res, next);
  });

  router.put('/users/:id', authCheck, function (req, res, next) {
    return ctrl.update(req, res, next, req.user);
  });

  router.delete('/users/:id', authCheck, function (req, res, next) {
    return ctrl.delete(req, res, next, req.user);
  });

}