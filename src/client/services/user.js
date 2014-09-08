angular.module('chessRank')
    .factory('userService', function ($resource) {
        return $resource('api/users/:userId',
            { userId: '@id' },
            { update: { method: 'PUT' } });
    })
    .service('signupService', function (userService) {
        this.validationRules = {
            name: {
                required: true,
                minlength: 2,
                maxlength: 50
            },
            surname: {
                required: true,
                minlength: 2,
                maxlength: 50
            },
            email: {
                required: true,
                type: 'email'
            },
            contactNumber: {
                required: true,
                pattern: /\+\d{11}/
            }
        };

        this.submit = function (request) {
            return userService.save(request);
        }

        return this;
    });