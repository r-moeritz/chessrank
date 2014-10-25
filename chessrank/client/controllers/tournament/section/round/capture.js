angular.module('chessRank')
    .controller('roundCaptureResultsCtrl', function (_, $scope, $state, $stateParams, section,
                                                     players, tournament, lookups, round, colour) {
        $scope.roundIndex = $stateParams.roundNumber - 1;
        $scope.results = getResults();

        function getResults() {
            whiteResults = _.filter(round.results, function (res) {
                return res.colour_hist[$scope.roundIndex] == colour.white;
            });
            return _.map(whiteResults, function (whiteRes) {
                var whitePlayer = _.find(players, function (p) {
                    return p._id.$oid === whiteRes.playerId.$oid;
                });
                var blackRes = _.find(round.results, function (res) {
                    return res.pairing_no === whiteRes.opponents[$scope.roundIndex];
                });
                var blackPlayer = _.find(players, function (p) {
                    return p._id.$oid === blackRes.playerId.$oid;
                });

                return {
                    white: whitePlayer,
                    black: blackPlayer
                };
            });
        }
    });
