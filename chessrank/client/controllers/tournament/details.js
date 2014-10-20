angular.module('chessRank')
    .controller('tournamentDetailsCtrl', function ($scope, $stateParams, sprintf, _, toaster, tournament, sections,
                                                   authService, authEvent, sectionService, sectionRegistrationAction) {
        $scope.currentUser = authService.currentUser;
        $scope.tournament = tournament;
        $scope.sections = sections;

        $scope.registerPopover = $scope.currentUser
            ? null
            : 'You need to login or sign up before you can register for tournaments';

        $scope.$on(authEvent.loginSuccess, function () {
            $scope.currentUser = authService.currentUser;
            $scope.registerPopover = null;
        });
        $scope.$on(authEvent.logoutSuccess, function () {
            $scope.currentUser = null;
            $scope.registerPopover = 'You need to login or sign up before you can register for tournaments';
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

            var now = moment.utc();
            var regStart = moment.utc(section.registrationStartDate.$date)
            var regEnd = moment.utc(section.registrationEndDate.$date)

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

        $scope.register = function (section) {
            if (!$scope.currentUser) {
                return;
            }

            var request = {
                action: sectionRegistrationAction.register
            };
            sectionService.update({ sectionId: section._id.$oid }, request,
                function () {
                    section.registeredPlayerIds.push($scope.currentUser.playerId);
                    toaster.pop('success', 'Success', sprintf('You have been provisionally registered in the %s',
                        section.name));
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
                        section.name));
                }, function (error) {
                    toaster.pop('error', 'Error', error.data.message || 'Unknown error');
                });
        }
    });