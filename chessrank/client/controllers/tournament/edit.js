angular.module('chessRank')
    .controller('tournamentEditCtrl', function ($scope, tournament, sections, lookups, tournamentEditHelper) {
        $scope.action = 'Edit';
        $scope.tournament = angular.copy(tournament);
        $scope.tournament.startDate = new Date($scope.tournament.startDate.$date);
        $scope.tournament.endDate = new Date($scope.tournament.endDate.$date);
        $scope.tournament.currency = _.find(lookups.currencies, function (cur) {
            return cur.value === tournament.registrationFeeCurrencyId;
        });
        $scope.sections = sections;
        $scope.currencyList = lookups.currencies;

        var helper = new tournamentEditHelper(tournament._id.$oid);
        helper.attach($scope);
    })
    .controller('tournamentAddCtrl', function ($scope, lookups, tournamentEditHelper, tournamentEditService) {
        $scope.action = 'Create';
        $scope.tournament = tournamentEditService.getTournamentToAdd();
        $scope.sections = tournamentEditService.getSectionsToAdd();
        $scope.currencyList = lookups.currencies;

        var helper = new tournamentEditHelper();
        helper.attach($scope);
    });