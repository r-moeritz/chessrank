angular.module('chessRank')
    .controller('sectionDetailsCtrl', function (_, $scope, section, tournament, players, rmArrayUtil) {
        $scope.tournament = tournament;
        $scope.section = section;
        $scope.players = players;

        $scope.confirmedPlayers = _.filter(players, function (p) {
            return rmArrayUtil.indexOf(section.confirmedPlayerIds,
                function (pid) { return pid.$oid === p._id.$oid; }) >= 0;
        });
    });