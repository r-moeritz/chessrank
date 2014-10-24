angular.module('chessRank')
    .controller('sectionEditPlayersCtrl', function (_, $scope, section, tournament, players, sectionService,
                                                    toaster, rmArrayUtil, sprintf, $modal) {
        $scope.section = section;
        $scope.tournament = tournament;
        $scope.players = players;

        $scope.confirmed = function (player) {
            return _.find(section.confirmedPlayerIds,
                function (pid) {
                    return pid.$oid === player._id.$oid;
                });
        }

        $scope.confirm = function (player) {
            var sectionCopy = angular.copy(section);

            var i = rmArrayUtil.indexOf(sectionCopy.registeredPlayerIds,
                function (pid) {
                    return pid.$oid === player._id.$oid;
                });
            sectionCopy.registeredPlayerIds.splice(i, 1);
            sectionCopy.confirmedPlayerIds.push(player._id);

            sectionService.update({ sectionId: section._id.$oid }, fixSectionData(sectionCopy)).$promise
                .then(function () {
                    section.registeredPlayerIds.splice(i, 1);
                    section.confirmedPlayerIds.push(player._id);
                    toaster.pop('success', 'Success', sprintf('Registration confirmed for %s %s',
                        player.name, player.surname));
                },
                function (error) {
                    toaster.pop('error', 'Error', error.data.message || 'Unknown error');
                });
        }

        $scope.unconfirm = function (player) {
            var sectionCopy = angular.copy(section);

            var i = rmArrayUtil.indexOf(sectionCopy.confirmedPlayerIds,
                function (pid) {
                    return pid.$oid === player._id.$oid;
                });
            sectionCopy.confirmedPlayerIds.splice(i, 1);
            sectionCopy.registeredPlayerIds.push(player._id);

            sectionService.update({ sectionId: section._id.$oid }, fixSectionData(sectionCopy)).$promise
                .then(function () {
                    section.confirmedPlayerIds.splice(i, 1);
                    section.registeredPlayerIds.push(player._id);
                    toaster.pop('success', 'Success', sprintf('Registration unconfirmed for %s %s',
                        player.name, player.surname));
                },
                function (error) {
                    toaster.pop('error', 'Error', error.data.message || 'Unknown error');
                });
        }

        $scope.unregister = function (player) {
            $scope.model = {
                title: 'Really?',
                description: sprintf('Are you sure you want to unregister %s %s?',
                    player.name, player.surname)
            }

            var inst = $modal.open({
                templateUrl: 'static/views/yesno.html',
                size: 'sm',
                scope: $scope
            });

            inst.result.then(function () {
                var sectionCopy = angular.copy(section);
                var confirmed = false;

                var i = rmArrayUtil.indexOf(sectionCopy.registeredPlayerIds,
                    function (pid) { return pid.$oid === player._id.$oid; });
                if (i >= 0) {
                    sectionCopy.registeredPlayerIds.splice(i, 1);
                } else {
                    confirmed = true;
                    i = rmArrayUtil.indexOf(sectionCopy.confirmedPlayerIds,
                        function (pid) { return pid.$oid === player._id.$oid; });
                    sectionCopy.confirmedPlayerIds.splice(i, 1);
                }

                sectionService.update({ sectionId: section._id.$oid }, fixSectionData(sectionCopy)).$promise
                    .then(function () {
                        if (confirmed) {
                            section.confirmedPlayerIds.splice(i, 1);
                        } else {
                            section.registeredPlayerIds.splice(i, 1);
                        }

                        $('#player_' + player._id.$oid).fadeOut();

                        toaster.pop('success', 'Success', sprintf('%s %s has been unregistered from the %s',
                            player.name, player.surname, section.name));
                    },
                    function (error) {
                        toaster.pop('error', 'Error', error.data.message || 'Unknown error');
                    });
            });
        }

        $scope.allowEditRegistration = function () {
            if (!$scope.currentUser || $scope.currentUser.userId.$oid !== section.ownerUserId.$oid
                || section.registrationManuallyClosed) {
                return false;
            }

            var now = moment().utc();
            if (section.registrationEndDate < now) {
                return false;
            }

            return true;
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
