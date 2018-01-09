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
        url: 'api/v1/fotos/upload',
        data: {file: file, nomeArquivo: file.name, tipoArquivo: file.type, tamanhoArquivo: file.size }
      });

      file.upload.then(
        function(response) {
          $timeout(function() {
            file.result = response.data;
          });
        },
        function(response) {
          if (response.status > 0)
            $scope.errorMsg = response.status + ': ' + response.data;
        },
        function(evt) {
          // Math.min is to fix IE which reports 200% sometimes
          file.progress = Math.min(
            100,
            parseInt(100.0 * evt.loaded / evt.total)
          );
        }
      );
    };
  }
]);
