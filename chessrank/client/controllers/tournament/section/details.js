angular.module('chessRank')
    .controller('sectionDetailsCtrl', function (_, $scope, $state, section, tournament, players, rmArrayUtil, 
                                                moment, sectionService, toaster, baseTypeConverter,
                                                sectionOwnerAction, roundStatus, $modal) {
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
            return $scope.allowEdit()
                && section.confirmedPlayerIds.length > 3
                && !registrationClosed();
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
            var haveResults = _.some(section.playerData, function (pd) {
                return pd.results.length >= roundIndex + 1;
            });
            return haveResults;
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

                sectionService.update({ sectionId: section._id.$oid }, fixSectionData(sectionCopy)).$promise
                    .then(function () {
                        section.registrationManuallyClosed = sectionCopy.registrationManuallyClosed;
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
    });