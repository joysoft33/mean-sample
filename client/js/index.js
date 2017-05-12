'use strict';

import angular from 'angular';

import 'angular-aria';
import 'angular-animate';
import 'angular-material';

import './templates';

import './components';
import './services';

export default angular.module('meanApp', [
  'ngAnimate',
  'ngMaterial',
  'templates',
  'appComponents',
  'appServices'
]);
