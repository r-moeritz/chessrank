angular.module('chessRank')
    .controller('signupCtrl', function ($scope, $modalInstance, authService, lookupsService) {
        $scope.titles = ['WCM', 'WFM', 'WIM', 'WGM', 'CM', 'FM', 'IM', 'GM'];

        $scope.datePickerOptions = {
            start: 'year',
            format: 'dd MMM yyyy',
            min: moment().subtract(120, 'years').toDate(),
            max: moment().subtract(4, 'years').toDate()
        };

        $scope.findFederation = function (filterText) {
            return lookupsService.getLookups().then(function (lookups) {
                var federations = lookups['fideFederations'];
                var results = [];
                var regex = new RegExp(filterText, 'i');
                angular.forEach(federations, function (item) {
                    if (regex.test(item.name)) {
                        results.push(item);
                    }
                });
                return results;
            });
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    });