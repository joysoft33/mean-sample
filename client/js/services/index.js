'use strict';

import angular from 'angular';
import cookies from 'angular-cookies';
import resource from 'angular-resource';

import usersService from './users';
import authService from './auth';

let services = angular.module('appServices', [
  cookies,
  resource
]);

services
  .factory('UsersService', usersService)
  .service('AuthService', authService);

export default services.name;