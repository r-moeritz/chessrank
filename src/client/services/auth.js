angular.module('chessRank')
    .service('authService', function ($http) {
        var _this = this;

        this.login = function (request) {
            return $http
                .post('api/session', request, {
                    withCredentials: true
                })
                .success(function (user) {
                    _this.currentUser = user;
                });
        }

        this.logout = function () {
            return $http
                .delete('api/session')
                .success(function () {
                    _this.currentUser = null;
                });
        }

        this.checkLoginStatus = function () {
            return $http
                .get('api/session')
                .success(function (user) {
                    _this.currentUser = user;
                });
        }

        return this;
    });