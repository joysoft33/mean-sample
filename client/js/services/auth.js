'use strict';

export default function ($http, $q, $timeout, localStorageService, $rootScope, CONSTANTS) {
  'ngInject';

  this.currentUser = null;

  this.login = (credential) => $q((resolve, reject) => {
    // Let server authenticate the given email/password
    $http.post(CONSTANTS.authUrl, credential).then((res) => {
      return this.saveToken(res.data.token);
    })
    .then((user) => {
      this.currentUser = user;
      resolve(this.currentUser);
    })
    .catch((err) => {
      this.removeToken();
      var message;
      if (err.data) {
        message = typeof err.data === 'string' ? err.data : err.data.message;
      }
      reject(message ? message : err.statusText);
    });
  });

  this.logout = () => $timeout(() => {
    // Just remove the authentication token
    this.removeToken();
  }, 0);

  this.getCurrent = () => $q((resolve, reject) => {
    // Get the authentication token if any
    var token = this.getToken();
    if (!token) {
      // No existing token, not connected
      return reject('Not authenticathed');
    }
    if (this.currentUser) {
      // Current user has already been set, return it
      return resolve(this.currentUser);
    }
    // Get user from saved token
    this._decodePayload(token).then((payload) => {
      this.currentUser = payload;
      resolve(payload);
    })
    .catch((err) => {
      this.removeToken();
      reject(err);
    });
  });

  this.setToken = (token) => $q((resolve, reject) => {
    // Decode and save the received token
    this.saveToken(token).then((payload) => {
      // Store the decoded user info
      this.currentUser = payload;
      resolve(payload);
    })
    .catch((err) => {
      this.removeToken();
      reject(err);
    });
  });

  this.saveToken = (token) => $q((resolve, reject) => {
    // Decode token payload before saving it into the cookie
    this._decodePayload(token).then((payload) => {
      $rootScope.$broadcast(CONSTANTS.authEvent, payload);
      localStorageService.set(CONSTANTS.authToken, token);
      resolve(payload);
    })
    .catch((err) => {
      this.removeToken();
      reject(err);
    });
  });

  this.removeToken = () => {
    if (this.currentUser != null) {
      // Remove jwt token from auth header of all requests made by the $http service
      $http.defaults.headers.common.Authorization = '';
      $rootScope.$broadcast(CONSTANTS.authEvent, null);
      this.currentUser = null;
    }
    localStorageService.remove(CONSTANTS.authToken);
  };

  this.getToken = () =>
    localStorageService.get(CONSTANTS.authToken);

  // Private methods
  this._decodePayload = (token) => $q((resolve, reject) => {
    // Decode the encrypted payload
    var data = token.split('.')[1];
    var payload = JSON.parse(decodeURI(this._base64ToUTF8(this._urlBase64Decode(data))));
    // Control the expiration date
    if (Math.round(new Date().getTime() / 1000) <= payload.exp) {
      // Add jwt token to auth header for all requests made by the $http service
      $http.defaults.headers.common.Authorization = 'Bearer ' + token;
      resolve(payload);
    } else {
      reject('Expired');
    }
  });

  this._base64ToUTF8 = (str) =>
    decodeURIComponent(escape(window.atob(str)));

  this._urlBase64Decode = (str) => {
    var output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw 'Illegal base64url string!';
    }
    return output;
  };
}