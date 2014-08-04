angular.module('chessRank')
    .controller('tournamentListCtrl', function ($scope) {
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
    });