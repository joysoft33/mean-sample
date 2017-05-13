'use strict';

import angular from 'angular';

import mainComponent from './main/main';
import homeComponent from './home/home';
import usersComponent from './users/users';

export default angular.module('appComponents', [])

  .component('main', mainComponent)
  .component('home', homeComponent)
  .component('users', usersComponent);