'use strict';

export default function ($http, $q) {
  'ngInject';

  const USERS_URL = '/api/users/';

  this.create = (user) => {
    return $q((resolve, reject) => {
      $http.post(USERS_URL, user).then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }

  this.update = (user) => {
    return $q((resolve, reject) => {
      $http.put(USERS_URL + user._id, user).then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
    });
  };

}