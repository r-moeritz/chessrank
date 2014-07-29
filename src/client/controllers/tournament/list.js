angular.module('chessRank')
    .controller('tournamentListCtrl', function ($scope, tournaments) {
        $scope.refresh = function () {
            $scope.tournaments = tournaments.query();
        }

        $scope.refresh();
    });