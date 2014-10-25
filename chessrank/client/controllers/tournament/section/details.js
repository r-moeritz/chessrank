angular.module('chessRank')
    .controller('sectionDetailsCtrl', function (_, $scope, section, tournament, players, rmArrayUtil, 
                                                moment, sectionService, toaster, baseTypeConverter) {
        $scope.tournament = tournament;
        $scope.section = section;
        $scope.players = players;

        var converter = new baseTypeConverter();

        $scope.confirmedPlayers = _.filter(players, function (p) {
            return rmArrayUtil.indexOf(section.confirmedPlayerIds,
                function (pid) { return pid.$oid === p._id.$oid; }) >= 0;
        });

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
            var round = section.roundData[roundIndex];
            return _.some(round.results,
                function (res) { return res.result; });
        }

        $scope.allowEdit = function () {
            return $scope.currentUser && $scope.currentUser.userId.$oid === section.ownerUserId.$oid;
        }

        $scope.closeRegistration = function () {
            var sectionCopy = angular.copy(section);

            sectionCopy.registrationManuallyClosed = converter.nowToBsonDate();

            sectionService.update({ sectionId: section._id.$oid }, fixSectionData(sectionCopy)).$promise
                .then(function () {
                    section.registrationManuallyClosed = sectionCopy.registrationManuallyClosed;
                    toaster.pop('success', 'Success', sprintf('Registration for %s - %s has been closed.',
                        tournament.name, section.name));
                },
                function (error) {
                    toaster.pop('error', 'Error', error.data.message || 'Unknown error');
                });
        }

        function completed(roundIndex) {
            var round = section.roundData[roundIndex];
            return round.results.length &&
                _.every(round.results, function (res) { return res.result; });
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
            var round = section.roundData[roundIndex];
            return round.results.length;
        }
    });