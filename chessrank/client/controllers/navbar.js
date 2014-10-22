angular.module('chessRank')
    .controller('navbarCtrl', function ($scope, $rootScope, $modal, authEvent, authService) {
        $scope.showLoginDialog = function () {
            $modal.open({
                templateUrl: 'static/views/auth/login.html',
                 controller: 'loginCtrl'
            });
        }

        $scope.logout = function () {
            authService.logout()
                .then(function () {
                    $rootScope.currentUser = null;
                    $rootScope.$broadcast(authEvent.logoutSuccess);
                });
        }

        $scope.checkLoginStatus = function () {
            authService.checkLoginStatus()
                .then(function (loggedInUser) {
                    $rootScope.currentUser = loggedInUser;
                    $rootScope.$broadcast(authEvent.loginSuccess);
                });
        }
    });