angular.module('chessRank')
    .directive('tournamentList', function () {
        return {
            restrict: 'E',
            scope: {
                tournaments: '=items'
            },
            templateUrl: 'static/views/tournament/list.html'
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