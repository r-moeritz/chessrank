angular.module('chessRank')
    .directive('userLink', function (userService) {
        return {
            restrict: 'E',
            scope: {
                userId: '='
            },
            template: '<a href="">{{ user.name }} {{ user.surname }}</a>',
            link: function (scope) {
                scope.user = userService.get({ userId: scope.userId.$oid });
            }
        }
    });