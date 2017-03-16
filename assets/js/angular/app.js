(function() {
    'use strict';

    var module = angular.module('scoreboard', [
        'ngRoute',
        'ui.bootstrap.tooltip',
        'scoreboard.controllers',
        'scoreboard.services',
        'scoreboard.directives'
    ]);

    var p = 'assets/js/angular/partials/';

    module.config(['$routeProvider', function($routeProvider) {
        $routeProvider.
          when('/about',         {templateUrl: p+'about.html',      controller: 'AboutCtrl'}).
          when('/results',       {templateUrl: p+'results.html',    controller: 'ResultsCtrl'}).
          when('/players',       {templateUrl: p+'players.html',    controller: 'PlayerCtrl'}).
          when('/payment',       {templateUrl: p+'payment.html',    controller: 'PaymentCtrl'}).
          when('/picks',         {templateUrl: p+'picks.html',      controller: 'PickCtrl'}).
          when('/messages',      {templateUrl: p+'messages.html',   controller: 'MessagesCtrl'}).
          when('/picks/:userId', {templateUrl: p+'picks.html',      controller: 'PickCtrl'}).
          otherwise({redirectTo: '/picks'});
    }]);

})();