'use strict';

import angular from 'angular';

import 'angular-ui-router';
import 'angular-aria';
import 'angular-animate';
import 'angular-material';

import '../../node_modules/angular-material/angular-material.scss';
import '../css/index.scss';

import './components';
import './services';

import routes from './routes';

let app = angular.module('meanApp', [
  'ui.router',
  'ngAnimate',
  'ngMaterial',
  'appComponents',
  'appServices'
]);

app.config(routes);

export default app;
