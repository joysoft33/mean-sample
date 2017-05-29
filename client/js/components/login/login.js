'use strict';

import styles from './login.scss';

export default {
  template: '<ui-view></ui-view>',
  css: styles,

  controller: function (AuthService) {
    'ngInject';

    this.$onInit = () => {
      // Force logout before atempting a new login
      AuthService.logout();
    };
  }
}