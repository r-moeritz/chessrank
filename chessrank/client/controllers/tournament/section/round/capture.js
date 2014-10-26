angular.module('chessRank')
    .controller('roundCaptureResultsCtrl', function (_, $scope, $state, $stateParams, section, players, sectionService,
                                                     tournament, lookups, colour, gameResult, ratingType, toaster,
                                                     sectionOwnerAction) {
        var roundIndex = $stateParams.roundNumber - 1

        $scope.roundNumber = $stateParams.roundNumber;
        $scope.games = getGames();

        var resultOptions = [
            { label: '1-0', value: gameResult.whiteWins },
            { label: '0-1', value: gameResult.blackWins },
            { label: '1/2-1/2', value: gameResult.draw },
            { label: '1F-0', value: gameResult.blackForfeits },
            { label: '0-1F', value: gameResult.whiteForfeits },
            { label: '0F-0F', value: gameResult.bothForfeit }
        ];
        $scope.resultDropDownOptions = {
            dataSource: resultOptions,
            dataTextField: 'label',
            dataValueField: 'value'
        };

        $scope.resultSelected = function (e) {
            var index = this.$angular_scope.$index;
            var result = this.dataItem(e.item.index()).value;
            var pnWhite = $scope.games[index].white.data.pairing_no;

            var whiteData = _.find(section.playerData, function (r) {
                return r.pairing_no === pnWhite;
            });
            var blackData = _.find(section.playerData, function (r) {
                return r.pairing_no === whiteData.opponents[roundIndex];
            });

            var pts = points(result);
            if (roundIndex == 0) {
                // first round
                whiteData.score = pts[0];
                blackData.score = pts[1];

                whiteData.results = [result];
                blackData.results = [result];
            } else {
                whiteData.score += pts[0];
                blackData.score += pts[0];
          
                whiteData.results.push(result);
                blackData.results.push(result);
            }

            sectionService.update({ sectionId: section._id.$oid }, JSON.stringify({
                action: sectionOwnerAction.captureResults,
                round: roundIndex + 1,
                results: section.playerData,
                finalize: false
            })).$promise.then(function () {
                toaster.pop('success', 'Success', 'Result saved', 1000);
            }, function (error) {
                toaster.pop('error', 'Error', error.data.message || 'Unknown error');
            });
        };

        function points(gameRes) {
            var result = [null, null];

            switch (gameRes) {
                case gameResult.blackWins:
                case gameResult.whiteForfeits:
                    result = [0, 1];
                    break;

                case gameResult.whiteWins:
                case gameResult.blackForfeits:
                    result = [1, 0];
                    break;

                case gameResult.draw:
                    result = [0.5, 0.5];
                    break;

                case gameResult.bothForfeit:
                    result = [0, 0];
                    break;
            }

            return result;
        }

        $scope.allResultsCaptured = function () {
            return _.every($scope.games, function (game) {
                return game.result !== null;
            });
        }

        $scope.finalizeResults = function () {
            sectionService.update({ sectionId: section._id.$oid }, JSON.stringify({
                action: sectionOwnerAction.captureResults,
                round: roundIndex + 1,
                results: section.playerData,
                finalize: true
            })).$promise.then(function () {
                $state.go('^', null, { reload: true });
            }, function (error) {
                toaster.pop('error', 'Error', error.data.message || 'Unknown error');
            });
        }

        function getGames() {
            var whiteRecords = _.filter(section.playerData, function (pd) {
                return pd.colour_hist[roundIndex] !== colour.black;
            });

            return _.map(whiteRecords, function (whiteData) {
                var whitePlayer = _.find(players, function (p) {
                    return p._id.$oid === whiteData.playerId.$oid;
                });

                var blackData = whiteData.opponents[roundIndex]
                    ? _.find(section.playerData, function (bpd) { return bpd.pairing_no === whiteData.opponents[roundIndex]; })
                    : null;
                var blackPlayer = blackData
                    ? _.find(players, function (p) { return p._id.$oid === blackData.playerId.$oid; })
                    : null;

                var result = (whiteData.results.length > roundIndex)
                    ? whiteData.results[roundIndex]
                    : null;

                return {
                    result: result,
                    white: { player: whitePlayer, data: whiteData },
                    black: { player: blackPlayer, data: blackData }
                };
            });
        }
    });
