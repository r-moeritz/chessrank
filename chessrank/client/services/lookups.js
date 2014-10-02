angular.module('chessRank')
    .service('lookupsService', function ($http, $q) {
        var _this = this;

        this.getLookups = function () {
            if (!_this.promise) {
                _this.promise = $http
                    .get('api/lookups')
                    .then(function (response) {
                        return response.data;
                    });
            }

            return _this.promise;
        }

        return this;
    });