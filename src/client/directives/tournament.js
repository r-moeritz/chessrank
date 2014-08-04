angular.module('chessRank')
    .directive('tournamentList', function () {
        return {
            restrict: 'E',
            scope: {
                tournaments: '=items'
            },
            templateUrl: 'static/views/tournament/list.html'
        }
    });