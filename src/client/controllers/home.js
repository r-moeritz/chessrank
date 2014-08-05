angular.module('chessRank')
    .controller('homeCtrl', function ($scope, filterFilter, tournamentsResource) {
        function isCurrentTournament(tournament) {
            var now = moment();
            return moment(tournament.startDate.$date).isBefore(now)
                && moment(tournament.endDate.$date).isAfter(now);
        }

        function isFutureTournament(tournament) {
            return moment(tournament.startDate.$date).isAfter(moment());
        }

        function isRecentTournament(tournament) {
            var endDate = moment(tournament.endDate.$date);
            var now = moment();
            return endDate.isBefore(now)
                && now.diff(endDate, 'days') < 90;
        }

        $scope.refresh = function () {
            tournamentsResource.query(function (tournaments) {
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