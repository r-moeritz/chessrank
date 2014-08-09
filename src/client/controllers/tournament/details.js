angular.module('chessRank')
    .controller('tournamentDetailsCtrl', function ($scope, $state, $stateParams, tournamentService) {
        if ($stateParams.tournamentId) {
            $scope.tournament = tournamentService.get({ tournamentId: $stateParams.tournamentId });
        }
    });