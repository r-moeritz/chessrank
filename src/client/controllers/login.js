angular.module('chessRank')
    .controller('loginCtrl', function ($scope, $modalInstance, $http) {
        $scope.submit = function (email, password) {
            $http.post('api/session', {
                   email: email,
                password: password
            }, {
                withCredentials: true
            }).success(function (data) {
                $modalInstance.close();
            }).error(function (error) {
                $scope.loginError = error;
            })
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    });