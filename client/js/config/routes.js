'use strict';

export default function ($stateProvider, $urlRouterProvider) {
  'ngInject';

  $stateProvider
    .state('home', {
      url: '/home',
      publicRoute: true,
      component: 'home'
    })
    .state('users', {
      url: '/users',
      component: 'users'
    })
    .state('login', {
      url: '',
      abstract: true,
      component: 'login'
    })
    .state('login.signup', {
      url: '/signup',
      publicRoute: true,
      component: 'signup'
    })
    .state('login.signin', {
      url: '/signin',
      publicRoute: true,
      component: 'signin'
    })
    .state('callback', {
      url: '/auth/callback/:token',
      publicRoute: true,
      params: {
        code: null,
        status: null,
        message: null
      },
      controller: function (AuthService, $stateParams, $state, $mdToast) {
        'ngInject';

        if ($stateParams.token) {
          AuthService.setToken($stateParams.token).then(() => {
            $state.go('home');
          })
          .catch((err) => {
            let message = err.data ? err.data.message || err.data : err;
            let toastContent = `Error: ${message} !`;
            $mdToast.showSimple(toastContent);
            $state.go('home');
          });
        } else {
          $state.go('home');
        }
      }
    });

  $urlRouterProvider.otherwise('/home');
}