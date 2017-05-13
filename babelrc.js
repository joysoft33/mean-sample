'use strict';

function config(server) {
  var presets = [
    'es2015', ['env', {
      targets: server ? {
        node: 'current'
      } : {
        browsers: ['> 5%', 'last 2 versions']
      },
      modules: false
    }]
  ];
  if (!server) {
    presets.push('angular');
  }
  return presets;
}

module.exports = (server) => config(server);