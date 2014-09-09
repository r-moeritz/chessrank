angular.module('chessRank')
    .controller('homeCtrl', function ($scope, filterFilter, tournamentService) {
        function currentTournament(tournament) {
            var now = moment();
            return moment(tournament.startDate.$date).isBefore(now)
                && moment(tournament.endDate.$date).isAfter(now);
        }

        function futureTournament(tournament) {
            return moment(tournament.startDate.$date).isAfter(moment());
        }

        function recentTournament(tournament) {
            var endDate = moment(tournament.endDate.$date);
            var now = moment();
            return endDate.isBefore(now)
                && now.diff(endDate, 'days') < 90;
        }

        $scope.refresh = function () {
            tournamentService.query(function (tournaments) {
                $scope.currentTournaments = filterFilter(tournaments, currentTournament);
                $scope.futureTournaments  = filterFilter(tournaments, futureTournament);
                $scope.recentTournaments  = filterFilter(tournaments, recentTournament);
            });
        }

        $scope.reset = function () {
            $scope.tournamentOptions = {
                showCurrent: true,
                 showFuture: true,
                 showRecent: true
            };
        }

        $scope.refresh();
        $scope.reset();
    });