angular.module('chessRank')
    .controller('tournamentListCtrl', function ($scope, tournaments) {
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

        $scope.refresh = function () {
            $scope.tournaments = tournaments.query();
        }

        $scope.refresh();
    })
    .controller('currentTournamentsCtrl', function ($scope) {
        $scope.selectTournaments = function (tournament) {
            var now = moment();
            return moment(tournament.startDate.$date).isBefore(now)
                && moment(tournament.endDate.$date).isAfter(now);
        }
    })
    .controller('futureTournamentsCtrl', function ($scope) {
        $scope.selectTournaments = function (tournament) {
            return moment(tournament.startDate.$date).isAfter(moment());
        }
    })
    .controller('recentTournamentsCtrl', function ($scope) {
        $scope.selectTournaments = function (tournament) {
            var endDate = moment(tournament.endDate.$date);
            var now = moment();
            return endDate.isBefore(now)
                && now.diff(endDate, 'days') < 90;
        }
    });