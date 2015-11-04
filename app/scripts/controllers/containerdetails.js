'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:ContainerDetailsCtrl
 * @description
 * # ContainerDetailsCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('ContainerDetailsCtrl', [
    '$scope',
    '$q',
    'ContainerService',
    'NotificationService',
    function ($scope, $q, ContainerService, NtfnService) {

      $scope.loadContainerDetails = function(containerId) {
        return ContainerService.getRegisteredContainer(containerId)
          .then(
            function(containerObj) {
              $scope.containerObj = containerObj;
            },
            function(response) {
              var message = '[' + response.status + '] ' + response.statusText;
              NtfnService.popError('Docker Container Details', message);
              return $q.reject(response);
            }
          );
      };

      $scope.getDaysAgo = function(timestamp) {
        var timeDiff = (new Date()).getTime() - timestamp;
        return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      };

      $scope.getDockerFile = function(containerId) {
        return ContainerService.getDockerFile(containerId)
          .then(
            function(dockerFile) {
              $scope.dockerFileString = dockerFile;
            },
            function(response) {
              var message = '[' + response.status + '] ' + response.statusText;
              NtfnService.popError('Docker Container Details', message);
              return $q.reject(response);
            }
          )
          .finally(
            function() { $scope.dockerFileLoaded = true; }
          );
      };

      $scope.getWFDescriptorFile = function(containerId) {
        return ContainerService.getWFDescriptorFile(containerId)
          .then(
            function(wfDescriptorFile) {
              $scope.wfDescriptorFileString = wfDescriptorFile;
            },
            function(response) {
              var message = '[' + response.status + '] ' + response.statusText;
              NtfnService.popError('Docker Container Details', message);
              return $q.reject(response);
            }
          ).finally(
            function() { $scope.wfDescriptorFileLoaded = true; }
          );
      };

      $scope.getGitHubURL = function(containerGitUrl) {
        if (containerGitUrl.length <= 0) return;
        var gitHubURLRegexp = /^git@github.com:(.*)\/(.*).git$/i;
        var matchRes = gitHubURLRegexp.exec(containerGitUrl);
        return 'https://github.com/' + matchRes[1] + '/' + matchRes[2];
      };

      $scope.getQuayIOURL = function(containerPath) {
        if (containerPath.length <= 0) return;
        var quayIOPathRegexp = /^quay\.io\/(.*)\/(.*)$/i;
        var matchRes = quayIOPathRegexp.exec(containerPath);
        return 'https://quay.io/repository/' + matchRes[1] + '/' + matchRes[2];
      };

      $scope.getVersionTags = function(containerObj) {
        var tags = containerObj ? containerObj.tags : null;
        if (!tags || tags.length === 0) return ['n/a'];
        var versionTags = [];
        var descTags = tags.sort(function(a, b) {
          return b.version.localeCompare(a.version);
        });
        for (var i = 0; i < descTags.length; i++) {
          versionTags.push(descTags[i].version);
        }
        return versionTags;
      };

      $scope.getDateTimeString = function(timestamp) {
        var moy = ['Jan.', 'Feb.', 'Mar.', 'Apr.',
                    'May', 'Jun.', 'Jul.', 'Aug.',
                    'Sept.', 'Oct.', 'Nov.', 'Dec.'];
        var dateObj = new Date(timestamp);
        return moy[dateObj.getMonth()] + ' ' +
                dateObj.getDate() + ', ' +
                dateObj.getFullYear() + ' at ' +
                dateObj.toLocaleTimeString();
      };

      $scope.loadDockerFile = function() {
        if (!$scope.dockerFileLoaded) {
          $scope.getDockerFile($scope.containerObj.id);
        }
      };

      $scope.loadWFDescriptorFile = function() {
        if (!$scope.wfDescriptorFileLoaded) {
          $scope.getWFDescriptorFile($scope.containerObj.id);
        }
      };

      $scope.loadContainerDetails($scope.containerId)
        .then(function(containerObj) {
          $scope.gitHubURL = $scope.getGitHubURL($scope.containerObj.gitUrl);
          $scope.quayIOURL = $scope.getQuayIOURL($scope.containerObj.path);
        });

  }]);
