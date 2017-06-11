'use strict';

export default function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('mean-sample')
    .setStorageType('sessionStorage')
    .setNotify(true, true)
}