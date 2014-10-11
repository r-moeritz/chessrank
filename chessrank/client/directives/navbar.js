angular.module('chessRank')
    .directive('navbar', function () {
        return {
            restrict: 'E',
            templateUrl: 'static/views/navbar.html',
            controller: 'navbarCtrl'
        }
    });