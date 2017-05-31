'use strict';

export default function (AuthService, $log, $state, $q, $transitions) {
  'ngInject';

  // ui-router transitions
  $transitions.onBefore({}, (transition) => {

    // Get the requested route
    var to = transition.to();

    if (!to.publicRoute) {

      const defer = $q.defer();

      AuthService.getCurrent().then(() => {

        // User isn’t authenticated, redirect to login page
        $log.debug(to.url + ' need authentication');

        defer.resolve(transition.router.stateService.target("login.signin", {
          redirect: to.name
        }));
      }).catch((err) => {
        defer.reject(err);
      });

      return defer.promise;
    }
  });

};