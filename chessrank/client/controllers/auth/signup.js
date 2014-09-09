angular.module('chessRank')
    .controller('signupCtrl', function ($scope, $modalInstance, lookupsService) {
        $scope.request = { gender: '0' };

        $scope.titles = [
            { label: 'WCM', value: 0 },
            { label: 'WFM', value: 1 },
            { label: 'CM',  value: 2 },
            { label: 'WIM', value: 3 },
            { label: 'FM',  value: 4 },
            { label: 'WGM', value: 5 },
            { label: 'IM',  value: 6 },
            { label: 'GM',  value: 7 }
        ];

        $scope.datePickerOptions = {
            start: 'year',
            format: 'dd MMM yyyy',
            min: moment().subtract(120, 'years').toDate(),
            max: moment().subtract(4, 'years').toDate()
        };

        $scope.$watch('filterFederations', function (filterText) {
            return lookupsService.getLookups().then(function (lookups) {
                var federations = lookups['fideFederations'];
                var results = [];
                var regex = new RegExp(filterText, 'i');
                angular.forEach(federations, function (item) {
                    if (regex.test(item.name)) {
                        results.push(item);
                    }
                });
                $scope.fideFederations = results;
            });
        });

        $scope.signupComplete = function () {
            $modalInstance.close();
        }

        $scope.signupFailed = function (error) {
            $scope.signupError = error.status;
        }

        $scope.clearErrors = function () {
            $scope.signupError = null
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    });