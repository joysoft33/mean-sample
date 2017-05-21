'use strict';

import angular from 'angular';
import cookies from 'angular-cookies';

import usersService from './users';
import authService from './auth';

export default angular.module('appServices', ['ngCookies'])

  .service('UsersService', usersService)
  .service('AuthService', authService)
  .name;