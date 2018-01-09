'use strict';

app.controller('FotoController', [
  '$scope',
  '$rootScope',
  '$http',
  'Upload',
  '$timeout',
  '$location',
  '$routeParams',
  'AlertService',
  'FotoService',
  function(
    $scope,
    $rootScope,
    $http,
    Upload,
    $timeout,
    $location,
    $routeParams,
    AlertService,
    FotoService
  ) {
    $scope.uploadPic = function(file) {
      file.upload = Upload.upload({
        url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
        data: {username: $scope.username, file: file},
      });

      file.upload.then(function (response) {
        $timeout(function () {
          file.result = response.data;
        });
      }, function (response) {
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
      }, function (evt) {
        // Math.min is to fix IE which reports 200% sometimes
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
      }
    }
]);
