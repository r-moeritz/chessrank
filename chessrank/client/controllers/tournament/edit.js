angular.module('chessRank')
    .controller('tournamentEditCtrl', function ($scope, tournament, sections, lookups, tournamentEditHelper,
                                                baseTypeConverter) {
        $scope.action = 'Edit';

        var converter = new baseTypeConverter();
        $scope.tournament = angular.copy(tournament);
        $scope.sections = sections;
        $scope.tournament.startDate = converter.bsonDateToJs($scope.tournament.startDate);
        $scope.tournament.endDate = converter.bsonDateToJs($scope.tournament.endDate);
        $scope.currencyList = lookups.currencies;
        $scope.tournament.currency = _.find(lookups.currencies,
            function (cur) {
                return cur.value === tournament.registrationFeeCurrencyId;
            });
        $scope.tournament.federation = _.find(lookups.fideFederations,
            function (fed) {
                return fed.value === tournament.federation;
            });

        var helper = new tournamentEditHelper(tournament._id);
        helper.attach($scope, lookups);
    })
    .controller('tournamentAddCtrl', function ($scope, lookups, tournamentEditHelper, tournamentEditService) {
        $scope.action = 'Create';

        $scope.tournament = tournamentEditService.getTournamentToAdd();
        $scope.sections = tournamentEditService.getSectionsToAdd();
        $scope.currencyList = lookups.currencies;

        var helper = new tournamentEditHelper();
        helper.attach($scope, lookups);
    });