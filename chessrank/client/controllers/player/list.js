angular.module('chessRank')
    .controller('playerListCtrl', function ($scope, players) {
        $scope.players = players;
    });