'use strict';

import template from './signup.html';

export default {

  template: template,

  controller: function (UsersService, AuthService, $state, $mdToast) {
    'ngInject';

    this.$onInit = () => {
      this.user = new UsersService();
    };

    this.signup = () => {
      this.user.$save((res) => {
        return AuthService.setToken(res.token);
      }).then(() => {
        $state.go('users');
      }).catch((err) => {
        let message = err.data ? err.data.message || err.data : err;
        let toastContent = `Error: ${message} !`;
        $mdToast.showSimple(toastContent);
      });
    };
  }
}