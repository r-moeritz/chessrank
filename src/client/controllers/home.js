angular.module('chessRank')
    .controller('homeCtrl', function ($scope) {
        $scope.reset = function () {
            $scope.tournamentOptions = {
                showCurrent: true,
                showFuture:  true,
                showRecent:  true
            };
        }

        $scope.reset();
    });