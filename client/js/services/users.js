'use strict';

export default function ($resource, CONSTANTS) {
  'ngInject';

  return $resource(CONSTANTS.usersUrl + '/:id', {
    id: '@_id'
  });
}