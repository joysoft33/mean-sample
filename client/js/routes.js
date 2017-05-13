'use strict';

export default function ($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state({
      name: 'home',
      url: '/home',
      component: 'home'
    });

  $urlRouterProvider.otherwise('/home');
}