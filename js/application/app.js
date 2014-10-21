angular.module('looplereloaded', ['ngRoute'])
  .config(['$locationProvider', '$httpProvider', '$routeProvider', '$provide', function ($locationProvider, $httpProvider, $routeProvider, $provide) {

    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

    $routeProvider
        .when('/', {
            controller: 'WelcomeController',
            templateUrl: 'ng-templates/welcome.html'
        })
        .when('/create-loops', {
            controller: 'GridController',
            templateUrl: 'ng-templates/grid.html'
        })
        .when('/create-loops/:id', {
            controller: 'GridController',
            templateUrl: 'ng-templates/grid.html'
        })
        .when('/play-loops', {
            controller: 'LiveController',
            templateUrl: 'ng-templates/live.html'
        })
        .otherwise({
            redirectTo: '/'
        });

    $provide.decorator('$sniffer', function ($delegate) {
        $delegate.history = false;
        return $delegate;
    });

    $locationProvider.html5Mode(true);   

  }
]);

