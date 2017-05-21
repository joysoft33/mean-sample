'use strict';

import template from './main.html';
import styles from './main.scss';

export default {

  template: template,
  css: styles,

  controller: function (AuthService, $state, $transitions, $log, $mdToast, $rootScope, CONSTANTS) {
    'ngInject';

    $transitions.onSuccess({}, (transition) => {
      this.selectedTab = transition.to().name;
      $log.debug('TAB:' + this.selectedTab);
    });

    this.$onInit = () => {
      AuthService.getCurrent().then((user) => {
        this.user = user;
      })
      .catch((err) => {
        $log.error(err);
        this.user = null;
      });
    };

    this.logout = () => {
      AuthService.logout().then(() => {
        $state.go('home');
      })
      .catch((err) => {});
    };

    $rootScope.$on(CONSTANTS.authEvent, (evt, user) => {
      this.user = user;
      if (user) {
        $mdToast.showSimple(`Welcome ${user.firstName} !`);
      } else {
        $mdToast.showSimple('Disconnected');
      }
    });
  }
}