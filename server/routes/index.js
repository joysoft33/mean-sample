'use strict';

let settings = require('../utilities/settings')();
let jwt = require('express-jwt');

module.exports = (app, password) => {

  // Initialize express JWT
  // It should receive the secretToken (the same one used to generate JWT token in User model)
  let authCheck = jwt({
    secret: settings.jwtSecret,
    getToken: (req) => {
      // Get Token is a function to tell JWT where our token is stored in users' requests
      // In our app, this token is stored in a cookie
      return req.cookies[settings.cookieToken];
    }
  });

  require('./auth')(app, password);
  require('./users')(app, authCheck);
}