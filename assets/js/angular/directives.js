(function() {
    'use strict';

    var module = angular.module('scoreboard.directives', []);

    module.directive('teamIcon', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                icon: '='
            },
            template: '<img src="http://www.ncaa.com{{icon}}" class="team-icon">'
        };
    });

    module.directive('winnings', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                player: '='
            },
            template: '<div>{{player}}</div>'
        };
    });
})();
