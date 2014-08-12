angular.module('chessRank')
    .controller('signupCtrl', function ($scope, $modalInstance, authService) {
        $scope.submit = function (request) {
            // TODO
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    });