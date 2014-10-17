angular.module('chessRank')
    .controller('tournamentEditCtrl', function ($scope, $state, moment, tournament, sections, lookups) {
        $scope.action = $state.current.data.action;
        $scope.tournament = angular.copy(tournament);
        $scope.tournament.startDate = new Date($scope.tournament.startDate.$date);
        $scope.tournament.endDate = new Date($scope.tournament.endDate.$date);
        $scope.sections = sections;

        $scope.currencyList = lookups.currencies;
        
        $scope.datePickerOptions = {
            start: 'year',
            format: 'dd MMM yyyy',
            min: moment().utc().subtract(6, 'months').toDate(),
            max: moment().utc().add(6, 'months').toDate()
        };

        $scope.editComplete = function () {
            $state.go('home');
        }

        $scope.editFailed = function (error) {
            $scope.editError = error.data.message || 'Unknown error';
        }

        $scope.clearError = function () {
            $scope.editError = null
        }

        $scope.deleteSection = function (section) {
            // TODO
        }
    });