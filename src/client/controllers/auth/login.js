angular.module('chessRank')
    .controller('loginCtrl', function ($scope, $rootScope, $modalInstance, authEvent, authService) {
        $scope.submit = function (request) {
            authService.login(request)
                .then(function () {
                    $modalInstance.close();
                    $rootScope.$broadcast(authEvent.loginSuccess);
                }, function (response) {
                    if (response.status === 300) {
                        request.overwriteExisting = true;
                    } else {
                        $scope.loginError = response.status;
                        $rootScope.$broadcast(authEvent.loginFailed);
                    }
                });
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    });