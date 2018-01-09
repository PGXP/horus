'use strict';

var app = angular
  .module('app', [
    'ngAria',
    'ngMessages',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngAnimate',
    'ngTouch',
    'ui.bootstrap',
    'notification',
    'ngWebsocket',
    'ngFileUpload',
    'Config'
  ])
  .config([
    '$routeProvider',
    '$httpProvider',
    'USER_ROLES',
    function($routeProvider, USER_ROLES) {
      $routeProvider.otherwise({
        redirectTo: '/dashboard',
        data: { authorizedRoles: [USER_ROLES.NOT_LOGGED] }
      });

      $routeProvider.when('/403', {
        templateUrl: 'views/403.html',
        data: { authorizedRoles: [USER_ROLES.NOT_LOGGED] }
      });

      $routeProvider.when('/foto', {
        templateUrl: 'views/foto.html',
        controller: 'FotoController',
        data: { authorizedRoles: [USER_ROLES.NOT_LOGGED] }
      });

      $routeProvider.when('/login', {
        templateUrl: 'views/login.html',
        controller: 'AuthController',
        data: { authorizedRoles: [USER_ROLES.NOT_LOGGED] }
      });

      $routeProvider.when('/', {
        templateUrl: 'views/dashboard/dashboard.html',
        controller: 'DashboardController',
        data: { authorizedRoles: [USER_ROLES.NOT_LOGGED] }
      });
    }
  ]);

app.config([
  '$httpProvider',
  '$websocketProvider',
  '$sceDelegateProvider',
  function($httpProvider, $websocketProvider, $sceDelegateProvider) {
    $websocketProvider.$setup({
      reconnect: true,
      reconnectInterval: 21000,
      enqueue: true
    });

    $sceDelegateProvider.resourceUrlWhitelist(['self']);

    $httpProvider.interceptors.push([
      '$q',
      '$rootScope',
      'AppService',
      'ENV',
      function($q, $rootScope, AppService, ENV) {
        return {
          request: function(config) {
            $rootScope.$broadcast('loading-started');

            var token = AppService.getToken();

            if (config.url.indexOf('api') !== -1) {
              if (config.url.indexOf(ENV.apiEndpoint) === -1) {
                config.url = ENV.apiEndpoint + config.url;
              }
            }

            if (token) {
              config.headers['Authorization'] = 'Token ' + token;
            }

            return config || $q.when(config);
          },
          response: function(response) {
            $rootScope.$broadcast('loading-complete');
            return response || $q.when(response);
          },
          responseError: function(rejection) {
            $rootScope.$broadcast('loading-complete');
            return $q.reject(rejection);
          },
          requestError: function(rejection) {
            $rootScope.$broadcast('loading-complete');
            return $q.reject(rejection);
          }
        };
      }
    ]);

    $httpProvider.interceptors.push([
      '$injector',
      function($injector) {
        return $injector.get('AuthInterceptor');
      }
    ]);
  }
]);

app.run([
  '$rootScope',
  '$location',
  '$window',
  'AUTH_EVENTS',
  'APP_EVENTS',
  'USER_ROLES',
  'AuthService',
  'AppService',
  'AlertService',
  'WS',
  '$notification',
  '$http',
  function(
    $rootScope,
    $location,
    $window,
    AUTH_EVENTS,
    APP_EVENTS,
    USER_ROLES,
    AuthService,
    AppService,
    AlertService,
    WS,
    $notification,
    $http
  ) {
    $rootScope.$on('$routeChangeStart', function(event, next) {
      if (next.redirectTo !== '/') {
        var authorizedRoles = next.data.authorizedRoles;

        if (
          authorizedRoles[0] !== undefined &&
          authorizedRoles.indexOf(USER_ROLES.NOT_LOGGED) === -1
        ) {
          if (!AuthService.isAuthorized(authorizedRoles)) {
            event.preventDefault();
            if (AuthService.isAuthenticated()) {
              // user is not allowed
              $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            } else {
              // user is not logged in
              $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }
          }
        }
      }
    });

    $rootScope.$on(AUTH_EVENTS.quantidade, function(emit, args) {
      $rootScope.$apply(function() {
        $rootScope.conectados = args.emit.data;
      });
    });

    $rootScope.$on(AUTH_EVENTS.notAuthorized, function() {
      console.log('notAuthorized');
      $location.path('/403');
    });

    $rootScope.$on(AUTH_EVENTS.notAuthenticated, function() {
      console.log('notAuthenticated');
      $rootScope.currentUser = null;
      AppService.removeToken();
      $location.path('/login');
    });

    $rootScope.$on(AUTH_EVENTS.sessionTimeout, function() {
      console.log('sessionTimeout');
    });

    $rootScope.$on(AUTH_EVENTS.loginFailed, function() {
      console.log('loginFailed');
      AppService.removeToken();
      $location.path('/login');
    });

    $rootScope.$on(AUTH_EVENTS.logoutSuccess, function() {
      console.log('logoutSuccess');
      WS.command('logout', $rootScope.currentUser.nome);
      $rootScope.currentUser = null;
      AppService.removeToken();
      $location.path('/dashboard');
    });

    $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
      $location.path('/dashboard');
      WS.command('login', $rootScope.currentUser.nome);
    });

    $rootScope.$on(APP_EVENTS.offline, function() {
      AlertService.addWithTimeout(
        'danger',
        'Servidor esta temporariamente indisponível, tente mais tarde'
      );
    });

    // Check if a new cache is available on page load.
    $window.addEventListener(
      'load',
      function(e) {
        $window.applicationCache.addEventListener(
          'updateready',
          function(e) {
            console.log($window.applicationCache.status);
            if (
              $window.applicationCache.status ===
              $window.applicationCache.UPDATEREADY
            ) {
              // Browser downloaded a new app cache.
              $window.location.reload();
              alert('Uma nova versão será carregada!');
            }
          },
          false
        );
      },
      false
    );
  }
]);

app.constant('APP_EVENTS', {
  offline: 'app-events-offline'
});

app.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized',
  exit: 'exit',
  sistema: 'sistema',
  mensagem: 'mensagem',
  produto: 'produto',
  fase: 'fase',
  quantidade: 'qtde'
});

app.constant('USER_ROLES', {
  ANALISE: 'ANALISE',
  PROSPECCAO: 'PROSPECCAO',
  INTERNALIZACAO: 'INTERNALIZACAO',
  SUSTENTACAO: 'SUSTENTACAO',
  DECLINIO: 'DECLINIO',
  ADMINISTRADOR: 'ADMINISTRADOR',
  CADASTRADOR: 'CADASTRADOR',
  CONSULTOR: 'CONSULTOR',
  LEGADO: 'LEGADO',
  NOT_LOGGED: 'NOT_LOGGED'
});

app.factory('AuthInterceptor', [
  '$rootScope',
  '$q',
  'AUTH_EVENTS',
  'APP_EVENTS',
  function($rootScope, $q, AUTH_EVENTS, APP_EVENTS) {
    return {
      responseError: function(response) {
        $rootScope.$broadcast(
          {
            0: APP_EVENTS.offline,
            404: APP_EVENTS.offline,
            503: APP_EVENTS.offline,
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
          }[response.status],
          response
        );

        return $q.reject(response);
      }
    };
  }
]);

app.value('version', '1.0.0');
