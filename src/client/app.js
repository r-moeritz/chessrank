'use strict'

angular.module('chessRank', ['ngResource', 'ui.router', 'ncy-angular-breadcrumb',
    'ui.bootstrap', 'kendo.directives', 'valdr', 'rmUtils.filters'])
    .config(function ($stateProvider, $urlRouterProvider, $breadcrumbProvider, valdrProvider) {
        $breadcrumbProvider.setOptions({
            templateUrl: 'static/views/breadcrumb.html'
        });

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'static/views/home.html',
                controller: 'homeCtrl',
                data: {
                    ncyBreadcrumbLabel: 'Home'
                }
            })
            .state('tournaments', {
                url: '/tournaments',
                views: {
                    '@': { templateUrl: 'static/views/tournament/list.html' }
                },
                data: {
                    ncyBreadcrumbLabel: 'Tournaments',
                    ncyBreadcrumbParent: 'home',
                    queryTournaments: true
                }
            })
            .state('tournaments.details', {
                url: '/:tournamentId',
                views: {
                    '@': {
                        templateUrl: 'static/views/tournament/details.html',
                        controller: 'tournamentDetailsCtrl'
                    }
                },
                data: {
                    ncyBreadcrumbLabel: '{{ tournament.name }}'
                }
            });

        valdrProvider.addConstraints({
            Login: {
                email: {
                    email: {
                        message: 'Must be a valid email address'
                    },
                    required: {
                        message: 'Email is required'
                    }
                },
                password: {
                    size: {
                        min: 8,
                        max: 200,
                        message: 'Must be between 8 and 200 characters'
                    },
                    required: {
                        message: 'Password is required'
                    }
                },
                rememberMe: {}
            },
            SignUp: {
                name: {
                    required: {
                        message: 'Name is required'
                    },
                    size: {
                        min: 2,
                        max: 50,
                        message: 'Must be between 2 and 50 characters'
                    }
                },
                surname: {
                    required: {
                        message: 'Surname is required'
                    },
                    size: {
                        min: 2,
                        max: 50,
                        message: 'Must be between 2 and 50 characters'
                    }
                },
                dateOfBirth: {
                    required: {
                        message: 'Date of Birth is required'
                    }
                },
                email: {
                    email: {
                        message: 'Must be a valid email address'
                    },
                    required: {
                        message: 'Email is required'
                    }
                },
                contactNumber: {
                    required: {
                        message: 'Contact Number is required'
                    },
                    pattern: {
                        value: /^\+\d{11}$/,
                        message: 'Must be a valid phone number in the format: +12345678901'
                    }
                },
                fideRating: {
                    digits: {
                        integer: 4,
                        fraction: 0,
                        message: 'Must be a natural number with less than 5 digits'
                    }
                },
                fedRating: {
                    digits: {
                        integer: 3,
                        fraction: 0,
                        message: 'Must be a natural number with less than 5 digits'
                    }
                },
                federation: {},
                union: {},
                fideTitle: {},
                fedTitle: {},
                male: {},
                female: {}
            }
        });
    });