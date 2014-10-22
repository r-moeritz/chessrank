angular.module('chessRank')
    .controller('tournamentListCtrl', function ($scope, tournaments) {
        $scope.tournaments = tournaments;
    });