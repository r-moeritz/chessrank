angular.module('chessRank')
    .controller('homeCtrl', function ($scope, filterFilter, tournamentService, baseTypeConverter) {
        var _this = this;
        this.converter = new baseTypeConverter();

        function isCurrentTournament(tournament) {
            var now = moment();
            return _this.converter.bsonDateToMoment(tournament.startDate).isBefore(now)
                && _this.converter.bsonDateToMoment(tournament.endDate).isAfter(now);
        }

        function isFutureTournament(tournament) {
            return _this.converter.bsonDateToMoment(tournament.startDate).isAfter(moment());
        }

        function isRecentTournament(tournament) {
            var endDate = _this.converter.bsonDateToMoment(tournament.endDate);
            var now = moment();
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