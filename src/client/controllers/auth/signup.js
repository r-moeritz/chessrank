angular.module('chessRank')
    .controller('signupCtrl', function ($scope, $modalInstance, authService, lookupsService) {
        $scope.titles = ['WCM', 'WFM', 'WIM', 'WGM', 'NM', 'CM', 'FM', 'IM', 'GM'];

        $scope.findFederation = function (filterText) {
            return lookupsService.getLookups().then(function (lookups) {
                var federations = lookups['fideFederations'];
                var results = [];
                angular.forEach(federations, function (item) {
                    if (item.name.indexOf(filterText) >= 0) {
                        results.push(item);
                    }
                });
                return results;
            });
        }

        $scope.submit = function (request) {
            // TODO
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    });