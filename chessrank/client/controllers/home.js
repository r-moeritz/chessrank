angular.module('chessRank')
    .controller('homeCtrl', function ($scope, filterFilter, tournamentService) {
        function isCurrentTournament(tournament) {
            var now = moment.utc();
            return moment.utc(tournament.startDate.$date).isBefore(now)
                && moment.utc(tournament.endDate.$date).isAfter(now);
        }

        function isFutureTournament(tournament) {
            return moment.utc(tournament.startDate.$date).isAfter(moment.utc());
        }

        function isRecentTournament(tournament) {
            var endDate = moment.utc(tournament.endDate.$date);
            var now = moment.utc();
            return endDate.isBefore(now)
                && now.diff(endDate, 'days') < 90;
        }

        $scope.refresh = function () {
            tournamentService.query(function (tournaments) {
                $scope.currentTournaments = filterFilter(tournaments, isCurrentTournament);
                $scope.futureTournaments  = filterFilter(tournaments, isFutureTournament);
                $scope.recentTournaments  = filterFilter(tournaments, isRecentTournament);
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