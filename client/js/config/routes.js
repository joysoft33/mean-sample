'use strict';

export default function ($stateProvider, $urlRouterProvider) {
  'ngInject';

  $stateProvider
    .state({
      name: 'home',
      url: '/home',
      publicRoute: true,
      component: 'home'
    })
    .state({
      name: 'users',
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
      params: {
        code: null,
        status: null,
        message: null
      },
      controller: function (AuthService, $stateParams, $state) {
        'ngInject';
        console.log($stateParams);
        if ($stateParams.token) {
          AuthService.setToken($stateParams.token).then((user) => {
            $state.go('home');
          })
          .catch((err) => {
            $state.go('home');
          });
        } else {
          $state.go('home');
        }
      }
    });

  $urlRouterProvider.otherwise('/home');
}