angular.module('chessRank')
    .controller('loginCtrl', function ($scope, $modalInstance, authEvent, authService) {
        $scope.submit = function (request) {
            authService.login(request)
                .success(function (data) {
                    $modalInstance.close();
                }).error(function (error) {
                    $scope.loginError = error;
                });
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    });