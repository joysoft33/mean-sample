'use strict';

export default function (AuthService, $log, $state, $transitions) {
  'ngInject';

  // ui-router transitions

  $transitions.onBefore({}, (transition) => {

    // Get the requested route
    var to = transition.to();

    if (to.authenticate && !AuthService.isAuthenticated()) {

      // User isn’t authenticated, redirect to login page
      $log.debug(to.url + ' need authentication');

      return transition.router.stateService.target("login", {
        redirect: to.name
      });
    }
  });

};
