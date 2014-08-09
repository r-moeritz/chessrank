angular.module('chessRank')
    .controller('navbarAuthCtrl', function ($scope, $modal, authEvent, userService, authService) {
        $scope.showLoginDialog = function () {
            $modal.open({
                templateUrl: 'static/views/auth/login.html',
                 controller: 'loginCtrl'
            });
        }

        $scope.logout = function () {
            authService.logout()
                .success(function () {
                    $rootScope.$broadcast(authEvent.logoutSuccess);
                    $scope.currentUser = null;
                });
        }

        $scope.$on(authEvent.loginSuccess, function () {
            $scope.currentUser = userService.currentUser;
        });
    });