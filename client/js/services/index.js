'use strict';

import angular from 'angular';
import resource from 'angular-resource';
import localStorage from 'angular-local-storage';

import usersService from './users';
import authService from './auth';

let services = angular.module('appServices', [
  localStorage,
  resource
]);

services
  .factory('UsersService', usersService)
  .service('AuthService', authService);

export default services.name;