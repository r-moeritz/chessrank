angular.module('chessRank')
    .controller('sectionEditCtrl', function (_, $scope, $state, moment, tournament, section, playSystem,
                                             tieBreak, lookups, timeControlFilter) {
        $scope.action = $state.current.data.action;
        $scope.section = angular.copy(section);
        $scope.section.timeControls = angular.toJson($scope.section.timeControls);
        $scope.section.startDate = new Date($scope.section.startDate.$date);
        $scope.section.endDate = new Date($scope.section.endDate.$date);
        $scope.section.registrationStartDate = new Date($scope.section.registrationStartDate.$date);
        $scope.section.registrationEndDate = new Date($scope.section.registrationEndDate.$date);

        $scope.currency = _.find(lookups.currencies,
            function (cur) {
                return cur.value === tournament.registrationFeeCurrencyId;
            });

        $scope.datePickerOptions = {
            start: 'year',
            format: 'dd MMM yyyy',
            min: moment().utc().subtract(6, 'months').toDate(),
            max: moment().utc().add(6, 'months').toDate()
        };

        $scope.playSystemOptions = [
            { label: 'Round Robin', value: playSystem.roundRobin },
            { label: 'Double Round Robin', value: playSystem.doubleRoundRobin },
            { label: 'Swiss', value: playSystem.swiss }
        ];

        $scope.tieBreakOptions = {
            dataTextField: 'label',
            dataValueField: 'value',
            dataSource: [
                { label: 'Neustadl', value: tieBreak.neustadl },
                { label: 'Buchholz', value: tieBreak.buchholz },
                { label: 'Median', value: tieBreak.median },
                { label: 'Modified Median', value: tieBreak.modifiedMedian }
            ]
        };

        $scope.timeControlOptions = _.map(lookups.stdTimeControls,
            function (tc) {
                return {
                    value: angular.toJson(tc),
                    label: _.map(tc, function (ctrl) {
                        return timeControlFilter(ctrl);
                    }).join(' ')
                }
            });

        $scope.editComplete = function () {
            $state.go('^');
        }

        $scope.editFailed = function (error) {
            $scope.editError = error.data.message;
        }

        $scope.clearError = function () {
            $scope.editError = null
        }
    });