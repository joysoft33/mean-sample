'use strict';

import template from './main.html';

export default {

  template: template,

  controller: function ($transitions) {
    'ngInject';

    $transitions.onSuccess({}, (transition) => {
      this.selectedTab = transition.to().name;
    });
  }
}