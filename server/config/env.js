'use strict';

let config = {

  'development': {
    db: process.env.MONGO_URL ||  'mongodb://localhost:27017/mean-sample-dev',
    cookieToken: 'mean-token-dev',
    jwtSecret: 'cJbdB3t$',
    facebookAuth: {
      clientID: process.env.FACEBOOK_ClientId,
      clientSecret: process.env.FACEBOOK_ClientSecret,
      callbackURL: '/api/auth/facebook/callback'
    }
  },
  
  'production': {
    db: process.env.MONGO_URL ||  'mongodb://localhost:27017/mean-sample',
    cookieToken: 'mean-token',
    jwtSecret: 'cJbdB3t$',
    facebookAuth: {
      clientID: '000000',
      clientSecret: '00000',
      callbackURL: '/api/auth/facebook/callback'
    }
  }
};

export default config;