angular.module('chessRank')
    .service('authService', function ($http) {
        var _this = this;

        this.login = function (request) {
            return $http
                .post('api/session', request, {
                    withCredentials: true
                })
                .then(function (response) {
                    _this.currentUser = response.data;
                });
        }

        this.logout = function () {
            return $http
                .delete('api/session')
                .then(function () {
                    _this.currentUser = null;
                });
        }

        this.checkLoginStatus = function () {
            return $http
                .get('api/session')
                .then(function (response) {
                    _this.currentUser = response.data;
                });
        }

        return this;
    });