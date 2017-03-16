(function () {
    'use strict';

    var module = angular.module('scoreboard.services', ['ngResource']);

    module.service('results',
        function ($http, $q) {
            this.getHomeScores = function (year) {
                if (year == 2013) {
                    return ['8', '9', '5', '4', '7', '3', '1', '6', '0', '2'];
                } else if (year == 2014) {
                    return ['9', '2', '5', '8', '4', '6', '7', '0', '3', '1'];
                } else if (year == 2015) {
                    return ['6', '8', '9', '0', '1', '3', '5', '7', '4', '2'];
                } else if (year == 2016) {
                    return ['9', '7', '2', '1', '3', '4', '8', '5', '0', '6'];
                } else if (year == 2017) {
                    return ['6', '7', '4', '0', '8', '5', '2', '9', '3', '1'];
                } else {
                    return [];
                }
            };
            this.getAwayScores = function (year) {
                if (year == 2013) {
                    return ['0', '9', '5', '1', '6', '7', '2', '3', '4', '8'];
                } else if (year == 2014) {
                    return ['0', '1', '7', '9', '5', '6', '2', '8', '4', '3'];
                } else if (year == 2015) {
                    return ['6', '9', '8', '7', '4', '2', '0', '5', '1', '3'];
                } else if (year == 2016) {
                    return ['1', '6', '2', '0', '4', '8', '7', '5', '3', '9'];
                } else if (year == 2017) {
                    return ['0', '5', '8', '7', '3', '2', '6', '1', '4', '9'];
                } else {
                    return [];
                }
            };
            this.getAllPicks = function (year) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: '../all_picks.php?year=' + year
                }).
                    success(function (data) {
                        var allPicks = {};
                        var playerWinnings = {};
                        for (var i in data) {
                            allPicks[data[i].pick_id] = data[i].user_id;
                            playerWinnings[data[i].user_id] = 0;
                        }
                        deferred.resolve({allPicks: allPicks, playerWinnings: playerWinnings});
                    }).
                    error(function (data) {
                        deferred.reject(data);
                    });

                return deferred.promise;


            };
            this.getResults = function ($scope, players) {
                var url = "http://data.ncaa.com/jsonp/gametool/brackets/championships/basketball-men/d1/" + ($scope.year - 1) + "/data.json?callback=JSON_CALLBACK";
                $scope.allPicks = {};
                var amounts = {
                    1: 0,
                    2: 5,
                    3: 10,
                    4: 20,
                    5: 40,
                    6: 95,
                    7: 180
                };
                $scope.roundDefinitions = {
                    7: 'Play-in',
                    6: 'Opening Round',
                    5: 'First Round',
                    4: 'Sweet 16',
                    3: 'Great 8',
                    2: 'Final 4',
                    1: 'Championship'
                };


                $scope.winnerScores = this.getHomeScores($scope.year);
                $scope.loserScores = this.getAwayScores($scope.year);
                $scope.rounds = [];
                $scope.gameDisplay = [];
                $scope.playerWinnings = [];
                var playerWinnings = {};
                this.getAllPicks($scope.year).then(
                    function (picks) {
                        $scope.allPicks = picks.allPicks;
                        playerWinnings = picks.playerWinnings;
                        $http.jsonp(url)
                            .success(function (data) {
                                $scope.errorMsg = null;
                                var games = data.games;
                                var gameDisplayList = [];
                                var rounds = {};
                                for (var game in games) {
                                    if (games[game].home.names.short && games[game].away.names.short) {
                                        var winnerScore = games[game].home.winner == "true" ? games[game].home.score.substr(-1) : games[game].away.score.substr(-1);
                                        var loserScore = games[game].home.winner == "false" ? games[game].home.score.substr(-1) : games[game].away.score.substr(-1);
                                        var amount = amounts[games[game].round];
                                        var pickId = $scope.loserScores.indexOf(loserScore) + '' + $scope.winnerScores.indexOf(winnerScore);
                                        var gameDisplay = {};
                                        gameDisplay['homeTeam'] = games[game].home.names.short;
                                        gameDisplay['homeScore'] = games[game].home.score;
                                        var homeTop = games[game].home.isTop === 'T';
                                        gameDisplay['awayRank'] = homeTop ? games[game].seedBottom : games[game].seedTop;
                                        gameDisplay['homeRank'] = homeTop ? games[game].seedTop : games[game].seedBottom;
                                        gameDisplay['homeIcon'] = games[game].home.iconURL;
                                        gameDisplay['awayTeam'] = games[game].away.names.short;
                                        gameDisplay['awayScore'] = games[game].away.score;
                                        gameDisplay['awayIcon'] = games[game].away.iconURL;
                                        gameDisplay['winnerScore'] = winnerScore;
                                        gameDisplay['loserScore'] = loserScore;
                                        gameDisplay['gameState'] = games[game].gameState;
                                        var winner = 'nobody';
                                        if (gameDisplay['gameState'] === 'final') {
                                            winner = $scope.allPicks[pickId];
                                        }
                                        gameDisplay['player'] = winner;
                                        gameDisplay['amount'] = amount;
                                        playerWinnings[winner] += amount;

                                        var dateArr = games[game].gameDateShort.trim().split(' ');
                                        var month = dateArr[0] == 'MAR' ? 2 : 3;
                                        var day = dateArr[1];
                                        var startTime = !!games[game].startTime ? (games[game].startTime) : '12:00:00';
                                        var hour = parseInt(startTime.trim().substring(0, 2)) + 12;
                                        var minute = startTime.trim().substring(3, 5);
                                        // eastern time
                                        gameDisplay['gameDate'] = new Date($scope.year, month, day, hour - 1, minute, 0, 0);

                                        gameDisplay['timeclock'] = games[game].timeclock;
                                        gameDisplay['currentPeriod'] = games[game].currentPeriod;
                                        gameDisplay['startTime'] = games[game].startTime;
                                        var bracketRound = 8 - games[game]['round'];
                                        if (rounds[(bracketRound)]) {
                                            rounds[(bracketRound)].push(gameDisplay);
                                        } else {
                                            rounds[(bracketRound)] = [gameDisplay];
                                        }
                                        //                            rounds[(bracketRound)].push(gameDisplay);
                                        gameDisplayList.push(gameDisplay);


                                        //                        gameDisplay.push(games[game].home.names.short + '[' + games[game].home.score + '] vs ' + games[game].away.names.short+ '[' + games[game].away.score + ']');
                                        //                        gameDisplay.push(winnerScore + '-' + loserScore + ' ' + $scope.allPicks[pickId] + ' wins $' + amount);
                                    }
                                }
                                $scope.rounds = rounds;
                                $scope.gameDisplay = gameDisplayList;
                                $scope.playerWinnings = [];

                                if (players.length) {
                                    for (var player in playerWinnings) {
                                        if (player != 'nobody') {
                                            var found = $.map(players, function (playerObj) {
                                                return playerObj.user_id === player ? playerObj : null;
                                            });
                                            if (found.length) {
                                                $scope.playerWinnings.push({
                                                    name: player,
                                                    winnings: playerWinnings[player],
                                                    paid: found[0].paid,
                                                    count: found[0].count
                                                });
                                            }
                                        }
                                    }
                                }
                            }).error(function (e) {
                                $scope.errorMsg = "Games have not started yet. Check back after the first game.[b]";
                                if (players.length) {
                                    for (var i = 0; i < players.length; i++) {
                                        $scope.playerWinnings.push({
                                            name: players[i].user_id,
                                            winnings: 0,
                                            paid: players[i].paid,
                                            count: players[i].count
                                        });
                                    }
                                }
                            });
                    },
                    function (reason) {
                        console.log('Error encountered: ' + reason);
                    }
                );
                return $scope;
            };
        });

})();