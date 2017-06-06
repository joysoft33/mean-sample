'use strict';

export default function (AuthService, $log, $state, $q, $transitions) {
  'ngInject';

  // ui-router transitions
  $transitions.onBefore({}, (transition) => {

    // Get the requested route
    var to = transition.to();

    if (!to.publicRoute) {

      return $q((resolve, reject) => {

        AuthService.getCurrent().then(() => {
          $log.debug(to.url + ' authenticated');
          resolve();
        })
        .catch(() => {
          // User isn’t authenticated
          $log.debug(to.url + ' need authentication');
          // Redirect to login page
          resolve(transition.router.stateService.target('login.signin', {
            redirect: to.name
          }));
        });
      });
    }
  });

};