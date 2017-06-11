'use strict';

import template from './signin.html';

export default {

  template: template,

  controller: function (AuthService, $state, $mdToast, $window, CONSTANTS) {
    'ngInject';

    this.signin = () => {
      // Local authentication mode
      AuthService.login(this.user).then(() => {
        $state.go('users');
      }).catch((err) => {
        $mdToast.showSimple(`Error : ${err} !`);
      });
    };

    this.facebook = () => {
      // FB authentication request
      $window.location = CONSTANTS.serverFacebookUrl;
    };
  }
}