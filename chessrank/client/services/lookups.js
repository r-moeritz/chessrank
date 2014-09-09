angular.module('chessRank')
    .service('lookupsService', function ($http, $q) {
        var _this = this;

        this.getLookups = function () {
            if (_this.lookups) {
                return $q.when(_this.lookups);
            }

            return $http
                .get('api/lookups')
                .then(function (response) {
                    _this.lookups = response.data;
                    return _this.lookups;
                });
        }

        return this;
    });