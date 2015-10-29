'use strict';

/**
 * @ngdoc service
 * @name dockstore.ui.TokenService
 * @description
 * # TokenService
 * Service in the dockstore.ui.
 */
angular.module('dockstore.ui')
  .service('TokenService', [
    '$rootScope',
    '$q',
    '$http',
    'WebService',
    'NotificationService',
    function ($rootScope, $q, $http,
              WebService, NtfnService) {
    
      this.getUserTokens = function(userId) {
        return $q(function(resolve, reject) {
          $http({
            method: 'GET',
            url: WebService.API_URI + '/users/' + userId + '/tokens'
          }).then(function(response) {
            resolve(response.data);
          }, function(response) {
            reject(response);
          });
        });
      };

      this.registerQuayIOToken = function(userId, accessToken) {
        return $q(function(resolve, reject) {
          $http({
            method: 'GET',
            url: WebService.API_URI + '/auth/tokens/quay.io/',
            params: {
              access_token: accessToken
            }
          }).then(function(response) {
            resolve(response.data);
          }, function(response) {
            reject(response);
          });
        });
      };

      this.deleteToken = function(tokenId) {
        return $q(function(resolve, reject) {
          $http({
            method: 'DELETE',
            url: WebService.API_URI + '/auth/tokens/' + tokenId
          }).then(function(response) {
            resolve(response.data);
          }, function(response) {
            reject(response);
          });
        });
      };

      this.getUserTokenStatusSet = function(userId) {
        return this.getUserTokens(userId)
          .then(
            function(tokens) {
              var tokenStatusSet = {
                dockstore: false,
                github: false,
                quayio: false
              };
              for (var i = 0; i < tokens.length; i++) {
                switch (tokens[i].tokenSource) {
                  case 'dockstore':
                    tokenStatusSet.dockstore = true;
                    break;
                  case 'github.com':
                    tokenStatusSet.github = true;
                    break;
                  case 'quay.io':
                    tokenStatusSet.quayio = true;
                    break;
                }
              }
              return tokenStatusSet;
            },
            function(response) {
              var message = '[' + response.status + '] ' + response.statusText;
              NtfnService.popError('User Accounts', message);
              return $q.reject(response);
            }
          );
      };

  }]);