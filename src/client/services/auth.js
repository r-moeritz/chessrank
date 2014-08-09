angular.module('chessRank')
    .service('userService', function () {
        this.setCurrentUser = function (user) {
            this.currentUser = user;
        }

        this.clearCurrentUser = function () {
            this.currentUser = null;
        }

        return this;
    })
    .factory('authService', function ($http, userService) {
        return {
            login: function (request) {
                return $http
                    .post('api/session', request, {
                        withCredentials: true
                    })
                    .success(function (user) {
                        userService.setCurrentUser(user);
                    });

            },

            logout: function () {
                return $http
                    .delete('api/session')
                    .success(function () {
                        userService.clearCurrentUser();
                    });
            },

            isAuthenticated: function () {
                return !!userService.currentUser;
            }
        };
    });