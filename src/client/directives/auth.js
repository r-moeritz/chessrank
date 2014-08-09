angular.module('chessRank')
    .directive('navbarAuthLinks', function () {
        return {
            restrict: 'E',
            templateUrl: 'static/views/auth/navbar.html'
        }
    });