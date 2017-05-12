'use strict';

import jwt from 'express-jwt';
import express from 'express';

import settings from '../utilities/settings';
import setUsersRoutes from './users';
import setAuthRoutes from './auth';

export default (app, passport) => {

  const router = express.Router();
  const env = settings();

  // Initialize express JWT
  // It should receive the secretToken (the same one used to generate JWT token in User model)
  let authCheck = jwt({
    secret: env.jwtSecret,
    getToken: (req) => {
      // Get Token is a function to tell JWT where our token is stored in users' requests
      // In our app, this token is stored in a cookie
      return req.cookies[env.cookieToken];
    }
  });

  setUsersRoutes(router, authCheck);
  setAuthRoutes(router, passport);

  return router;  
}