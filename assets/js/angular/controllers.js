(function() {
    'use strict';

    var module = angular.module('scoreboard.controllers', [
        'scoreboard.services'
    ]);
    module.config(['$httpProvider', function($httpProvider) {
        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        // Answer edited to include suggestions from comments
        // because previous version of code introduced browser-related errors

        // extra
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    }]);
    module.controller('PaymentCtrl', function($scope, $http) {
        $scope.year = 2017;
        $http.get('../paid.php?year=' + $scope.year).success(function(data) {
            $scope.players = data;
        });

        $scope.addPayment = function(user, amount) {
             $http.get('../add_payment.php?user_id=' + user + '&paid=' + amount).success(function(data) {
             });
        };
    });

    module.controller('MessagesCtrl', function($scope, $http, $filter) {
        $scope.messages = [];
        $scope.message = '';
        $scope.userId = '';
        $http.get('../all_messages.php').success(function(data) {
            $scope.messages = data;
        });
        $scope.addMessage = function() {
            if ($scope.message === '') {
                $scope.errorMsg = 'Please enter a message';
            } else if ($scope.userId === '') {
                $scope.errorMsg = 'Please enter your name';
            } else {
                var dateString = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                console.log(dateString);
                $http.get('../insert_message.php?user_id=' + $scope.userId + '&message=' + $scope.message).success(function(data) {
                    $scope.messages.push({id:parseInt(data), user_id: $scope.userId, MESSAGE: $scope.message, date_time: dateString});
                    $scope.successMsg = 'Successfully added message!'
                });
            }
        };
        $scope.toJsDate = function(str){
            if (angular.isDate(str)) return str;
            if (!str) return null;
            return new Date(str);
          }
    });

    module.controller('NavCtrl', function($scope, $location) {
        $scope.location = $location;
    });

    module.controller('AboutCtrl', function($scope, $location) {
        $scope.location = $location;
    });

    module.controller('PlayerCtrl', function($scope, $http, results) {
        $scope.year = 2017;
        $scope.changeYear = function(year) {
            $scope.year = year;
            $http.get('../paid.php?year=' + $scope.year).success(function(data) {
                $scope.players = data;
                results.getResults($scope, data);
        //        var json = JSON.parse(data);
                var totalCount = 0;
                var totalCollected = 0;
                for (var i in data) {
                    totalCount += parseInt(data[i].count);
                    totalCollected += parseInt(data[i].paid);
                }
                $scope.totalCount = totalCount;
                $scope.totalCollected = totalCollected;
            });
        };
        $scope.changeYear($scope.year);
    });


    module.controller('ResultsCtrl', function($scope, results) {
        $scope.year = 2017;
        $scope.changeYear = function(year) {
            $scope.year = year;
            results.getResults($scope, []);
        };
        $scope.changeYear($scope.year);
    });

    module.controller('DashboardCtrl', function($scope, $http, $location) {
        $scope.userId = '';
        $scope.notFound = false;
        $scope.signin = function() {
            var userId = $scope.userId;
            $http.get('../user.php?id=' + userId).success(function(data) {
                if (data != '') {
                    $location.path( "/picks/" + $scope.userId);
                } else {
                    $scope.notFound = true;
                }
            }).error(function() {
                $scope.notFound = true;
            });

        };
    });
    module.controller('PickCtrl', function($scope, $http, $routeParams, results) {
        var userId = $routeParams.userId;
        $scope.email = '';
        $scope.allPicks = {};
        $scope.notFound = false;
        $scope.year = 2017;
        $http.get('../user.php?id=' + userId).success(function(data) {
            $scope.user = data;
        });

        $scope.rows = [0,1,2,3,4,5,6,7,8,9];
        $scope.columns = [0,1,2,3,4,5,6,7,8,9];

        $scope.changeYear = function(year) {
            $scope.year = year;
            $scope.allPicks = {};
            $http.get('../all_picks.php?year=' + year).success(function(data) {
                for(var i in data) {
                    $scope.allPicks[data[i].pick_id] = data[i].user_id;
                }
            });
            $scope.homeScores = results.getHomeScores(year);
            $scope.awayScores = results.getAwayScores(year);
        };
        $scope.setUser = function() {
            $http.get('../user.php?id=' + $scope.email)
                    .success(function(data) {
                        if (data === '') {
                            $scope.notFound = true;
                        } else {
                            $scope.notFound = false;
                            $scope.user = data;
                        }
                    })
        };
        $scope.pickIt = function() {
            var pickId = this.row + '' + this.column;
            $scope.allPicks[pickId] = $scope.user;
            $http.get('../insert_pick.php?user_id=' + $scope.user + '&pick_id=' + pickId + '&year=' + $scope.year).success(function(data) {
            });
        };
        $scope.unPickIt = function() {
            var pickId = this.row + '' + this.column;
            delete $scope.allPicks[pickId];
            $http.get('../remove_pick.php?user_id=' + $scope.user + '&pick_id=' + pickId + '&year=' + $scope.year).success(function(data) {
            });
        };
        $scope.findPick = function() {
            var pickId = this.row + '' + this.column;
            return $scope.allPicks[pickId];
        };
        $scope.ownPick = function() {
            var pickId = this.row + '' + this.column;
            return ($scope.allPicks[pickId] == $scope.user) ? 'red' : '';
        };
        $scope.totalPicks = function() {
            var count = 0;
            for (var key in $scope.allPicks) {
                if ($scope.allPicks[key] == $scope.user) count++;
            }
            return count;
        };
        $scope.changeYear($scope.year);
    });
})();