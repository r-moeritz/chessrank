angular.module('chessRank')
    .directive('federation', function (_, lookupsService) {
        return {
            restrict: 'E',
            scope: {
                value: '='
            },
            template: '<span><img ng-src="static/images/flags/{{ federation.name }}.png" alt="Flag of {{ federation.name }}" /> {{ federation.name }}</span>',
            link: function (scope) {
                lookupsService.getLookups()
                    .then(function (lookups) {
                        scope.federation = _.find(lookups.fideFederations,
                            function (fed) {
                                return fed.value === scope.value;
                            });
                    });
            }
        }
    });
