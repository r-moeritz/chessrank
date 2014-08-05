angular.module('chessRank')
    .controller('tournamentListCtrl', function ($scope, $state, tournamentsResource) {
        $scope.registrationClosed = function (tournament) {
            var now = moment();
            angular.forEach(tournament.sections, function (section) {
                if (moment(section.registrationEndDate.$date).isBefore(now)
                    && moment(section.registrationEndDate.$date).isAfter(now))
                    return false;
            });
            return true;
        }

        $scope.tournamentFinished = function (tournament) {
            return moment(tournament.endDate.$date).isBefore(moment());
        }

        if ($state.current.data.queryTournaments) {
            $scope.tournaments = tournamentsResource.query();
        }
    });