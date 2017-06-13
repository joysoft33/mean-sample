'use strict';

import UsersController from '../controllers/users';

/**
 * Configure the User API routes.
 * @param {*} router The express router object
 * @param {*} authCheck The passport object
 */
export default function (router, authCheck) {

  let ctrl = new UsersController();

  // The user creation route must not be authenticated (signup process)
  router.post('/users', (req, res, next) => ctrl.create(req, res, next));

  // All other routes cannot be accessed without connected user
  router.get('/users', authCheck, (req, res, next) => ctrl.find(req, res, next, req.user));
  router.get('/users/:id', authCheck, (req, res, next) => ctrl.findById(req, res, next, req.user));
  router.put('/users/:id', authCheck, (req, res, next) => ctrl.update(req, res, next, req.user));
  router.delete('/users/:id', authCheck, (req, res, next) => ctrl.delete(req, res, next, req.user));
}