'use strict';

import angular from 'angular';

import authService from './auth';
import usersService from './users';

export default angular.module('appServices', [])

  .service('AuthService', authService)
  .service('UsersService', usersService)
  .name;