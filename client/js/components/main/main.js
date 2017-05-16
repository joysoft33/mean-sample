'use strict';

import template from './main.html';
import styles from './main.scss';

export default {

  template: template,

  css: styles,

  controller: function ($transitions) {
    'ngInject';

    $transitions.onSuccess({}, (transition) => {
      this.selectedTab = transition.to().name;
    });
  }
}