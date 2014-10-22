angular.module('chessRank')
    .directive('userLink', function (userLookupService) {
        return {
            restrict: 'E',
            scope: {
                userId: '='
            },
            template: '<a href="">{{ user.name }} {{ user.surname }}</a>',
            link: function (scope) {
                userLookupService.findUser(scope.userId)
                    .then(function (user) {
                        scope.user = user;
                    });
            }
        }
    });