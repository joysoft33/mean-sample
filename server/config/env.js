'use strict';

let config = {

  'development': {
    db: process.env.MONGODB_URI || 'mongodb://localhost:27017/mean-sample-dev',
    cookieToken: 'mean-token-dev',
    jwtSecret: 'cJbdB3t$',
    facebookAuth: {
      clientID: process.env.FACEBOOK_ClientId || '0000',
      clientSecret: process.env.FACEBOOK_ClientSecret || '0000',
      callbackURL: '/api/auth/facebook/callback'
    }
  },
  
  'production': {
    db: process.env.MONGODB_URI || 'mongodb://localhost:27017/mean-sample',
    cookieToken: 'mean-token',
    jwtSecret: 'cJbdB3t$',
    facebookAuth: {
      clientID: process.env.FACEBOOK_ClientId || '0000',
      clientSecret: process.env.FACEBOOK_ClientSecret || '0000',
      callbackURL: '/api/auth/facebook/callback'
    }
  }
};

export default config;