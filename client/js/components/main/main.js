'use strict';

import template from './main.html';
import styles from './main.scss';

export default {

  template: template,
  css: styles,

  controller: function (AuthService, $state, $transitions, $log, $mdToast, $rootScope, CONSTANTS) {
    'ngInject';

    $transitions.onSuccess({}, (transition) => {
      // Watch route change to update the selected menu tab
      this.selectedTab = transition.to().name;
      $log.debug('TAB:' + this.selectedTab);
    });

    this.$onInit = () => {
      AuthService.getCurrent().then((user) => {
        // Save the currently connected user if any
        this.user = user;
      })
      .catch((err) => {
        $log.info(err);
        this.user = null;
      });
    };

    this.logout = () => {
      // Disconnect and display home page
      AuthService.logout().then(() => {
        $state.go('home');
      });
    };

    // Listen at authentication messages (see auth service)
    $rootScope.$on(CONSTANTS.authEvent, (evt, user) =>  {
      // Save the currently connected user and display the according message
      this.user = user;
      if (user) {
        $mdToast.showSimple(`Welcome ${user.firstName} !`);
      } else {
        $mdToast.showSimple('Disconnected');
      }
    });
  }
}