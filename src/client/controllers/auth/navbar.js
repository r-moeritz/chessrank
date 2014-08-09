angular.module('chessRank')
    .controller('navbarAuthCtrl', function ($scope, $rootScope, $modal, authEvent,
                                            authService, userService) {
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
                })
                .error(function (error) {
                    1 + 1;
                });
        }

        $scope.checkLoginStatus = function () {
            authService.checkLoginStatus()
                .success(function () {
                    $rootScope.$broadcast(authEvent.loginSuccess);
                })
                .error(function (error) {
                    // TODO: Handle error
                })
        }

        $scope.$on(authEvent.loginSuccess, function () {
            $scope.currentUser = userService.currentUser;
        });
        $scope.$on(authEvent.logoutSuccess, function () {
            $scope.currentUser = null;
        });
    });