angular.module('chessRank')
    .controller('navbarAuthCtrl', function ($scope, $rootScope, $modal, authEvent, authService) {
        $scope.showLoginDialog = function () {
            $modal.open({
                templateUrl: 'static/views/auth/login.html',
                 controller: 'loginCtrl'
            });
        }

        $scope.logout = function () {
            authService.logout()
                .then(function () {
                    $rootScope.$broadcast(authEvent.logoutSuccess);
                });
        }

        $scope.checkLoginStatus = function () {
            authService.checkLoginStatus()
                .then(function () {
                    $rootScope.$broadcast(authEvent.loginSuccess);
                });
        }

        $scope.$on(authEvent.loginSuccess, function () {
            $scope.currentUser = authService.currentUser;
        });
        $scope.$on(authEvent.logoutSuccess, function () {
            $scope.currentUser = null;
        });
    });