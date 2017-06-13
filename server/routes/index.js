'use strict';

import express from 'express';
import jwt from 'express-jwt';

import settings from '../utilities/settings';
import setUsersRoutes from './users';
import setAuthRoutes from './auth';

/**
 * Configure server API routes.
 * @param {*} passport The passport object
 */
export default function (passport) {

  const router = express.Router();
  const env = settings();

  // Use authCheck as middleware, it will check JWT token
  // and if JWT is ok, then it will set req.user (by default) in which we will find our payload information
  // If JWT isn't ok, it will send back an unauthorized error and prevent user from accessing this url
  // So, it checks if user is at least logged in (otherwise JWT token shouldn't be set / be right)
  let authCheck = jwt({
    secret: env.jwtSecret,
  });

  setUsersRoutes(router, authCheck);
  setAuthRoutes(router, passport);

  return router;
}