angular.module('chessRank')
    .controller('tournamentDetailsCtrl', function ($scope, sprintf, _, toaster, tournament, sections,
                                                   authEvent, sectionService, sectionRegistrationAction) {
        $scope.tournament = tournament;
        $scope.sections = sections;

        $scope.registerPopover = $scope.currentUser
            ? null
            : 'You need to logged in before you can register for tournaments';

        $scope.$on(authEvent.loginSuccess, function () {
            $scope.registerPopover = null;
        });
        $scope.$on(authEvent.logoutSuccess, function () {
            $scope.registerPopover = 'You need to be logged in to register for tournaments';
        });

        $scope.registered = function (section) {
            if (!$scope.currentUser) {
                return false;
            }

            return _.find(section.registeredPlayerIds, function (playerId) {
                return playerId.$oid === $scope.currentUser.playerId.$oid;
            });
        }

        $scope.registrationClosed = function (section, allSections) {
            if (section.invitationOnly) {
                return true;
            }

            var now = moment();
            var regStart = moment(section.registrationStartDate.$date)
            var regEnd = moment(section.registrationEndDate.$date)

            if (regStart.isAfter(now) || regEnd.isBefore(now)) {
                return true;
            }

            if (allSections && $scope.currentUser) {
                for (var i = 0; i != allSections.length; ++i) {
                    var sec = allSections[i];
                    if ($scope.registered(sec)) {
                        return true;
                    }
                }
            }

            return false;
        }

        $scope.register = function(section) {
            if (!$scope.currentUser) {
                return;
            }

            var request = {
                action: sectionRegistrationAction.register
            };
            sectionService.update({ sectionId: section._id.$oid }, request,
                function () {
                    section.registeredPlayerIds.push($scope.currentUser.playerId);
                    toaster.pop('success', 'Success', sprintf('You are registered for the %s; your registration is '
                        + 'provisional pending confirmation by the tournament director.', section.name), 8000);
                },
                function (error) {
                    toaster.pop('error', 'Error', error.data.message || 'Unknown error');
                });;
        }

        $scope.unregister = function (section) {
            if (!$scope.currentUser) {
                return;
            }

            var request = {
                action: sectionRegistrationAction.unregister
            };
            sectionService.update({ sectionId: section._id.$oid }, request,
                function () {
                    section.registeredPlayerIds = _.reject(section.registeredPlayerIds,
                        function (playerId) {
                            return playerId.$oid === $scope.currentUser.playerId.$oid;
                        });
                    toaster.pop('success', 'Success', sprintf('You have been unregistered from the %s',
                        section.name), 1000);
                }, function (error) {
                    toaster.pop('error', 'Error', error.data.message || 'Unknown error');
                });
        }
    });