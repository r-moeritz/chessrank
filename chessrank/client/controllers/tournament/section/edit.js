angular.module('chessRank')
    .controller('sectionEditDetailsCtrl', function (_, $scope, $state, tournament, section, lookups, sectionEditHelper) {
        $scope.action = 'Edit';
        $scope.section = angular.copy(section);
        $scope.section.timeControls = angular.toJson($scope.section.timeControls);
        $scope.section.startDate = new Date($scope.section.startDate.$date);
        $scope.section.endDate = new Date($scope.section.endDate.$date);
        $scope.section.registrationStartDate = new Date($scope.section.registrationStartDate.$date);
        $scope.section.registrationEndDate = new Date($scope.section.registrationEndDate.$date);

        var helper = new sectionEditHelper();
        helper.attach($scope, tournament, lookups);
    })
    .controller('sectionAddCtrl', function (_, $scope, $state, tournament, lookups, sectionEditHelper) {
        $scope.action = 'Create';
        $scope.section = {
            tournamentId: tournament._id || tournament.fakeId,
            fakeId: new Date().getTime(),
            invitationOnly: false
        };

        var helper = new sectionEditHelper();
        helper.attach($scope, tournament, lookups);
    });
