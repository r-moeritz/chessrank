angular.module('chessRank')
    .controller('sectionDetailsCtrl', function ($scope, _, section, tournament, lookups, playerLookupService) {
        $scope.section = section;

        var playerIds = _.map(section.registeredPlayerIds,
            function (pid) { return pid.$oid; });

        playerLookupService.findPlayers(playerIds).then(
            function (players) {
                $scope.players = players;
            });
    });