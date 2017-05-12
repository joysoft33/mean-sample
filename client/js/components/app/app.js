'use strict';

import angular from 'angular';

export default angular.module('appComponents')

  .component('app', {

    templateUrl: './app.html',

    controller: function() {
      'ngInject';

    }
  });
