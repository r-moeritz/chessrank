angular.module('chessRank')
    .service('authService', function ($http) {
        var _this = this;

        this._currentUser = null;

        this.getCurrentUser = function () {
            return _this._currentUser;
        }

        this.login = function (request) {
            return $http
                .post('api/session', request, {
                    withCredentials: true
                })
                .then(function (response) {
                    _this._currentUser = response.data;
                    return _this._currentUser;
                });
        }

        this.logout = function () {
            return $http
                .delete('api/session')
                .then(function () {
                    _this._currentUser = null;
                });
        }

        this.checkLoginStatus = function () {
            return $http
                .get('api/session')
                .then(function (response) {
                    _this._currentUser = response.data;
                    return _this._currentUser;
                });
        }

        return this;
    })
    .service('loginService', function (authService) {
        this.validationRules = {
            email: {
                required: true,
                type: 'email'
            },
            password: {
                required: true,
                minlength: 8,
                maxlength: 200
            }
        };

        this.submit = function (request) {
            return authService.login(request);
        }

        return this;
    });