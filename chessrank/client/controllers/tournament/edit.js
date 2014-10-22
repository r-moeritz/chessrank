angular.module('chessRank')
    .controller('tournamentEditCtrl', function ($scope, tournament, sections, lookups, tournamentEditHelper,
                                                tournamentEditService) {
        $scope.action = 'Edit';
        $scope.tournament = angular.copy(tournament);
        $scope.tournament.startDate = new Date($scope.tournament.startDate.$date);
        $scope.tournament.endDate = new Date($scope.tournament.endDate.$date);
        $scope.sections = sections.concat(tournamentEditService.getSectionsToAddOrUpdate());
        $scope.currencyList = lookups.currencies;

        var helper = new tournamentEditHelper();
        helper.attach($scope);
    })
    .controller('tournamentAddCtrl', function ($scope, lookups, tournamentEditHelper, tournamentEditService) {
        $scope.action = 'Create';
        $scope.tournament = tournamentEditService.getTournamentToAdd();
        $scope.sections = tournamentEditService.getSectionsToAddOrUpdate();
        $scope.currencyList = lookups.currencies;

        var helper = new tournamentEditHelper();
        helper.attach($scope);
    });