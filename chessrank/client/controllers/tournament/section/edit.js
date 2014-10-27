angular.module('chessRank')
    .controller('sectionEditDetailsCtrl', function (_, $scope, $state, tournament, section, lookups,
                                                    sectionEditHelper, baseTypeConverter) {
        $scope.action = 'Edit';

        var converter = new baseTypeConverter();
        $scope.section = angular.copy(section);
        $scope.section.timeControls = angular.toJson($scope.section.timeControls);
        $scope.section.startDate = converter.bsonDateToJs($scope.section.startDate);
        $scope.section.endDate = converter.bsonDateToJs($scope.section.endDate);
        $scope.section.registrationStartDate = converter.bsonDateToJs($scope.section.registrationStartDate);
        $scope.section.registrationEndDate = converter.bsonDateToJs($scope.section.registrationEndDate);
        _.each($scope.section.roundData, function (rd) {
            rd.startTime = converter.bsonDateToJs(rd.startTime);
        });

        var helper = new sectionEditHelper();
        helper.attach($scope, tournament, lookups);
    })
    .controller('sectionAddCtrl', function (_, $scope, $state, tournament, lookups, sectionEditHelper) {
        $scope.action = 'Create';

        $scope.section = {
            tournamentId: tournament._id || tournament.fakeId,
            fakeId: new Date().getTime(),
            invitationOnly: false,
            rounds: 3,
            roundData: [],
            playerData: [],
            registrationManuallyClosed: null,
            registeredPlayerIds: [],
            confirmedPlayerIds: []
        };

        var helper = new sectionEditHelper();
        helper.attach($scope, tournament, lookups);
    });
