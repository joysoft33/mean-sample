'use strict';

import angular from 'angular';

import template from './home.html';

export default angular.module('appComponents')

  .component('home', {

    template: template,

    controller: function() {
      'ngInject';

    }
  });
