'use strict';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import messages from 'angular-messages';
import material from 'angular-material';
import css from 'angular-css';

import 'angular-material/angular-material.css';
import 'mdi/css/materialdesignicons.css';
import '../css/index.scss';

import components from './components';
import services from './services';
import config from './config';

let app = angular.module('meanApp', [
  uiRouter,
  material,
  messages,
  css,
  components,
  services
]);

app.constant('CONSTANTS', config.constants);
app.config(config.storage);
app.config(config.routes);
app.run(config.run);

export default app;