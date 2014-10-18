angular.module('chessRank')
    .controller('tournamentEditCtrl', function ($scope, $state, $modal, moment, tournament, sections,
                                                lookups, sprintf, sectionService) {
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

        $scope.confirmDeleteSection = function () {
            var id = this.item._id.$oid;
            var name = this.item.name;

            $scope.model = {
                title: 'Confirm delete',
                description: sprintf('Are you sure you want to delete the %s?', name)
            }

            var inst = $modal.open({
                templateUrl: 'static/views/yesno.html',
                size: 'sm',
                scope: $scope
            });

            inst.result.then(function () {
                sectionService.delete({ sectionId: id },
                    function () {
                        $('#section_' + id).fadeOut();
                    },
                    function (error) {
                        // TODO: Display toast with error info
                    });
            });
        }
    });