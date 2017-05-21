'use strict';

import template from './signin.html';

export default {

  template: template,

  controller: function (AuthService, $state, $mdToast, $window, CONSTANTS) {
    'ngInject';

    this.signin = () => {
      AuthService.login(this.user).then((user) => {
        $state.go('users');
      }).catch((err) => {
        let message = err.data ? err.data.message || err.data : err;
        let toastContent = `Error : ${message} !`;
        $mdToast.showSimple(toastContent);
      });
    };

    this.facebook = () => {
      $window.location = CONSTANTS.serverFacebookUrl;
    }
  }
}