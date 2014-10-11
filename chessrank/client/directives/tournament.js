angular.module('chessRank')
    .directive('tournamentList', function (authService, authEvent) {
        return {
            restrict: 'E',
            scope: {
                tournaments: '=items'
            },
            templateUrl: 'static/views/tournament/list.html',
            link: function (scope) {
                scope.currentUser = authService.currentUser;

                scope.$on(authEvent.loginSuccess, function () {
                    scope.currentUser = authService.currentUser;
                });
                scope.$on(authEvent.logoutSuccess, function () {
                    scope.currentUser = null;
                });
            }
        }
    })
    .directive('tournamentCurrency', function (lookupsService, currencyFilter) {
        return {
            restrict: 'E',
            template: '{{ formattedAmount }}',
            scope: {
                tournament: '=',
                amount: '='
            },
            link: function (scope) {
                lookupsService.getLookups().then(function (lookups) {
                    var symbol = null;
                    for (var i = 0; i != lookups.currencies.length; ++i) {
                        var currency = lookups.currencies[i];
                        if (currency.value === scope.tournament.registrationFeeCurrencyId) {
                            symbol = currency.symbol;
                            break;
                        }
                    }
                    scope.formattedAmount = (symbol == null)
                        ? scope.amount
                        : currencyFilter(scope.amount, symbol);
                });
            }
        }
    });