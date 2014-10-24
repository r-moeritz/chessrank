angular.module('chessRank')
    .controller('sectionDetailsCtrl', function (_, $scope, section, tournament, players, rmArrayUtil, 
                                                moment, sectionService, toaster) {
        $scope.tournament = tournament;
        $scope.section = section;
        $scope.players = players;

        $scope.confirmedPlayers = _.filter(players, function (p) {
            return rmArrayUtil.indexOf(section.confirmedPlayerIds,
                function (pid) { return pid.$oid === p._id.$oid; }) >= 0;
        });

        $scope.allowCloseRegistration = function () {
            if (!$scope.currentUser.userId || $scope.currentUser.userId.$oid !== section.ownerUserId.$oid
                || section.confirmedPlayerIds.length < 4 || section.registrationManuallyClosed) {
                return false;
            }

            var now = moment().utc();
            if (section.registrationEndDate < now) {
                return false;
            }

            return true;
        }

        $scope.closeRegistration = function () {
            var sectionCopy = angular.copy(section);

            var now = moment().utc();
            sectionCopy.registrationManuallyClosed = now;

            sectionService.update({ sectionId: section._id.$oid }, fixSectionData(sectionCopy)).$promise
                .then(function () {
                    section.registrationManuallyClosed = { '$date': moment.utc().toDate().getTime() };
                    toaster.pop('success', 'Success', sprintf('Registration for %s - %s has been closed.',
                        tournament.name, section.name));
                },
                function (error) {
                    toaster.pop('error', 'Error', error.data.message || 'Unknown error');
                });
        }

        function fixSectionData(sectionCopy) {
            delete sectionCopy._id;
            delete sectionCopy.ownerUserId;

            sectionCopy.tournamentId = sectionCopy.tournamentId.$oid;
            sectionCopy.startDate = new Date(sectionCopy.startDate.$date);
            sectionCopy.endDate = new Date(sectionCopy.endDate.$date);
            sectionCopy.registrationStartDate = new Date(sectionCopy.registrationStartDate.$date);
            sectionCopy.registrationEndDate = new Date(sectionCopy.registrationEndDate.$date);
            sectionCopy.registeredPlayerIds = _.map(sectionCopy.registeredPlayerIds,
                function (playerId) { return playerId.$oid });
            sectionCopy.confirmedPlayerIds = _.map(sectionCopy.confirmedPlayerIds,
                function (playerId) { return playerId.$oid });

            return sectionCopy;
        }
    });