angular.module('chessRank')
    .controller('sectionDetailsCtrl', function (_, $scope, $state, section, tournament, players, rmArrayUtil, 
                                                moment, sectionService, toaster, baseTypeConverter, colour,
                                                sectionOwnerAction, roundStatus, $modal, tieBreak, scoringUtil) {
        $scope.tournament = tournament;
        $scope.section = section;
        $scope.players = players;

        var converter = new baseTypeConverter();

        $scope.confirmedPlayers = _.filter(players, function (p) {
            return rmArrayUtil.indexOf(section.confirmedPlayerIds,
                function (pid) { return pid.$oid === p._id.$oid; }) >= 0;
        });

        $scope.pair = function (roundIndex) {
            sectionService.update({ sectionId: section._id.$oid }, {
                action: sectionOwnerAction.pairRound,
                round: roundIndex + 1
            }).$promise.then(function () {
                $state.go('a.tournaments.details.section.capture_round',
                    { 'roundNumber': roundIndex + 1 },
                    { reload: true });
            }, function (error) {
                toaster.pop('error', 'Error', error.data.message || 'Unknown error');
            });
        }

        $scope.allowCloseRegistration = function () {
            // HACK: hard-coding swiss logic
            return $scope.allowEdit()
                && !registrationClosed()
                && swissRounds(section.confirmedPlayerIds.length) >= section.rounds;
        }

        $scope.allowPairing = function (roundIndex) {
            if (!$scope.allowEdit() || !registrationClosed() || paired(roundIndex)) {
                return false;
            }

            return (roundIndex === 0)
                ? true
                : completed(roundIndex - 1);
        }

        $scope.allowCapture = function (roundIndex) {
            return $scope.allowEdit() && paired(roundIndex) && !completed(roundIndex);
        }

        $scope.resultsAvailable = function (roundIndex) {
            return _.some(section.playerData, function (pd) {
                return pd.results.length >= roundIndex + 1;
            });
        }

        $scope.allRoundsComplete = function () {
            return _.every(section.playerData, function (pd) {
                return pd.results.length === section.rounds;
            }) && _.every(section.roundData, function (rd) {
                return rd.status === roundStatus.completed;
            });
        }

        $scope.rankPlayers = function () {
            var compositePlayerData = _.map($scope.confirmedPlayers,
                function (p) {
                    var playerRecord = _.find(section.playerData,
                        function (rec) {
                            return rec.playerId === p.playerId;
                        });

                    return {
                        player: p,
                        data: playerRecord
                    };
                });

            var rankedPlayerData = _.sortBy(compositePlayerData,
                function (cpd) {
                    return tieBreakScore(cpd.data, tieBreak.buchholz);
                });
            rankedPlayerData = _.sortBy(rankedPlayerData,
                function (cpd) {
                    return cpd.data.score;
                });

            return rankedPlayerData.reverse();
        }

        $scope.finalScore = function (playerId) {
            // TODO
        }

        $scope.scoreOfFirstEncounter = function (playerRecord, opponentId) {
            if (playerRecord.playerId === opponentId) {
                return '*';
            }

            var opponentRecord = _.find(section.playerData,
                function (rec) {
                    return rec.playerId == opponentId;
                });

            var gameIndex = -1;
            for (var i = 0; i != playerRecord.opponents; ++i) {
                var pn = playerRecord.opponents[i].pairing_no;
                if (pn === opponentRecord.pairing_no) {
                    gameIndex = i;
                    break;
                }
            }

            if (gameIndex < 0) {
                // Encounter didn't take place
                return '-';
            }

            var result = playerRecords.results[gameIndex];
            if (result === gameResult.bye) {
                return 1;
            }

            var pts = scoringUtil.points(result);
            var colour = playerRecord.colour_hist[gameIndex];

            return (colour === colour.white) ? pts[0] : pts[1];
        }

        $scope.allowEdit = function () {
            return $scope.currentUser && $scope.currentUser.userId.$oid === section.ownerUserId.$oid;
        }

        $scope.closeRegistration = function () {
            $scope.model = {
                title: 'Are you sure?',
                description: sprintf('%d players registrations have not been confirmed; if you close registration '
                    + 'these players will be unregistered. Do you want to proceeed?', section.registeredPlayerIds.length)
            };

            var inst = $modal.open({
                templateUrl: 'static/views/yesno.html',
                size: 'sm',
                scope: $scope
            });

            inst.result.then(function () {
                var sectionCopy = angular.copy(section);
                sectionCopy.registrationManuallyClosed = converter.nowToBsonDate();
                sectionCopy.registeredPlayerIds = []

                sectionService.update({ sectionId: section._id.$oid }, fixSectionData(sectionCopy)).$promise
                    .then(function () {
                        section.registrationManuallyClosed = sectionCopy.registrationManuallyClosed;
                        section.registeredPlayerIds = []
                        toaster.pop('success', 'Success', sprintf('Registration has been closed for the %s of the %s.',
                            tournament.name, section.name), 1000);
                    },
                    function (error) {
                        toaster.pop('error', 'Error', error.data.message || 'Unknown error');
                    });
            });
        }

        function completed(roundIndex) {
            return section.roundData[roundIndex].status === roundStatus.completed;
        }

        function registrationClosed() {
            return section.registrationManuallyClosed 
                || converter.bsonDateToMoment(section.registrationEndDate) < moment();
        }

        function fixSectionData(sectionCopy) {
            delete sectionCopy._id;
            delete sectionCopy.ownerUserId;

            return JSON.stringify(sectionCopy);
        }

        function paired(roundIndex) {
            var status = section.roundData[roundIndex].status;
            return status !== roundStatus.unpaired;
        }

        function swissRounds(players) {
            // TODO: This function should be moved out of the details view
            return Math.ceil(Math.log(players) / Math.log(2));
        }

        function tieBreakScore(playerRecord, tb) {
            switch (tb) {
                case tieBreak.buchholz:
                    return _.reduce(playerRecord.opponents,
                        function (memo, pn) {
                            var opponent = _.find(section.playerData,
                                function (rec) {
                                    return rec.pairing_no === pn;
                                });

                            return memo + opponent.score;
                        }, 0);
            }

            return 0;
        }
    });