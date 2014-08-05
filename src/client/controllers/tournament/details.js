angular.module('chessRank')
    .controller('tournamentDetailsCtrl', function ($scope, $state, $stateParams, tournamentsResource) {
        if ($stateParams.tournamentId) {
            $scope.tournament = tournamentsResource.get({ tournamentId: $stateParams.tournamentId });
        }
    });