'use strict';

app.factory('FotoService', ['$http', function($http){

    var service = {};

    service.excluir = function(id){
      return $http
        .delete('api/fotos/' + id)
        .then(function(res) {
          return;
        }
      );
    };

    service.carregarAnexos = function(id){
      return $http
        .get('api/fotos/' + id)
        .then(function(res) {
          return res.data;
        }
      );
    };

    return service;
  }]);
