'use strict';

let config = {

  development: {
    db: process.env.MONGODB_URI || 'mongodb://localhost:27017/mean-sample-dev',
    cookieToken: 'mean-token',
    jwtSecret: 'cJbdB3t$',
    facebookAuth: {
      clientID: process.env.FACEBOOK_ClientId,
      clientSecret: process.env.FACEBOOK_ClientSecret,
      callbackURL: '/auth/facebook/callback'
    }
  },

  production: {
    db: process.env.MONGODB_URI || 'mongodb://heroku_k38xhh52:3fpqr8knth6fs4q0pr5r605qco@ds131512.mlab.com:31512/heroku_k38xhh52',
    cookieToken: 'mean-token',
    jwtSecret: 'cJbdB3t$',
    facebookAuth: {
      clientID: process.env.FACEBOOK_ClientId,
      clientSecret: process.env.FACEBOOK_ClientSecret,
      callbackURL: '/api/auth/facebook/callback'
    }
  }
};

export default config;