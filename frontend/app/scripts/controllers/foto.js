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
    $scope.uploadFiles = function(file, errFiles) {
      $scope.f = file;
      $scope.errFile = errFiles && errFiles[0];
      if (file) {
        file.upload = Upload.upload({
          url: 'api/v1/fotos/upload',
          data: {
            file: file,
            foto: { id: '1', description: 'teste' },
            nomeArquivo: file.name,
            tipoArquivo: file.type,
            tamanhoArquivo: file.size
          }
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
            file.progress = Math.min(
              100,
              parseInt(100.0 * evt.loaded / evt.total)
            );
          }
        );
      }
    };
  }
]);
