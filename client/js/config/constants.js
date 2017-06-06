'use strict';

import ENV from '../../../server/config/env';

export default {
  authEvent: 'AUTH',
  authUrl: '/api/auth',
  authCookie: ENV[process.env.NODE_ENV || 'development'].cookieToken,
  serverFacebookUrl: '/api/auth/facebook'
}