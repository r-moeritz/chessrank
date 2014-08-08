angular.module('chessRank')
    .controller('navbarController', function ($scope, $modal) {
        $scope.showLoginDialog = function () {
            $modal.open({
                templateUrl: 'static/views/login.html',
                 controller: 'loginCtrl'
            });
        }
    });