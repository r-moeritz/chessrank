angular.module('chessRank')
    .controller('tournamentListCtrl', function ($scope, authService, authEvent, tournaments) {
        $scope.currentUser = authService.currentUser;
        $scope.tournaments = tournaments;

        $scope.$on(authEvent.loginSuccess, function () {
            $scope.currentUser = authService.currentUser;
        });
        $scope.$on(authEvent.logoutSuccess, function () {
            $scope.currentUser = null;
        });
    });