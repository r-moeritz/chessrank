angular.module('chessRank')
    .controller('tournamentDetailsCtrl', function ($scope, $stateParams, toaster, tournament, authService,
                                                   authEvent, sectionService, sectionRegistrationAction) {
        $scope.currentUser = authService.currentUser;
        $scope.tournament = tournament;

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

        $scope.sections = sectionService.query({ tournamentId: $stateParams.tournamentId });

        $scope.registered = function (section) {
            if (!$scope.currentUser) {
                return false;
            }

            return section.registeredPlayerIds.indexOf($scope.currentUser.playerId) >= 0;
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

            var alreadyRegistered = false;

            if (allSections) {
                for (var i = 0; i != allSections.length; ++i) {
                    var sec = allSections[i];
                    if (sec.registeredPlayerIds.indexOf($scope.currentUser.playerId) >= 0) {
                        alreadyRegistered = true;
                        break;
                    }
                }
            }

            return alreadyRegistered;
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
                    toaster.pop('success', 'Success', 'You have been provisionally registered');
                });
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
                    var index = section.registeredPlayerIds.indexOf($scope.currentUser.playerId);
                    if (index >= 0) {
                        section.registeredPlayerIds.splice(index, 1);
                    }
                    toaster.pop('success', 'Success', 'You have been unregistered')
                });
        }
    });