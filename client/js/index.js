'use strict';

import angular from 'angular';
import 'angular-ui-router';

import 'angular-aria';
import 'angular-animate';
import 'angular-material';
import 'angular-css';

import '../../node_modules/angular-material/angular-material.scss';
import '../css/index.scss';

import './components';
import './services';

import config from './config';

let app = angular.module('meanApp', [
  'ui.router',
  'ngAnimate',
  'ngMaterial',
  'angularCSS',
  'appComponents',
  'appServices'
]);

app.config(config.routes);
app.run(config.run);

export default app;
