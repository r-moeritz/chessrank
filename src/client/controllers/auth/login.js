angular.module('chessRank')
    .controller('loginCtrl', function ($scope, $rootScope, $modalInstance, authEvent, authService) {
        $scope.submit = function (request) {
            authService.login(request)
                .success(function (data) {
                    $modalInstance.close();
                    $rootScope.$broadcast(authEvent.loginSuccess);
                }).error(function (error) {
                    if (error.status_code === 300) {
                        request.overwriteExisting = true;
                    } else {
                        $scope.loginError = error;
                        $rootScope.$broadcast(authEvent.loginFailed);
                    }
                });
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    });