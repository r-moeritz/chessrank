'use strict'

angular.module('chessRank', ['ngResource', 'ui.router', 'ngAnimate', 'ncy-angular-breadcrumb',
    'ui.bootstrap', 'kendo.directives', 'formFor', 'toaster', 'rmUtils.filters'])
    .config(function ($stateProvider, $urlRouterProvider, $breadcrumbProvider) {
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
                    '@': {
                        templateUrl: 'static/views/tournament/list.html',
                        controller: 'tournamentListCtrl'
                    }
                },
                data: {
                    ncyBreadcrumbLabel: 'Tournaments',
                    ncyBreadcrumbParent: 'home',
                },
                resolve: {
                    tournamentService: 'tournamentService',
                    tournaments: function (tournamentService) {
                        return tournamentService.query().$promise;
                    }
                },
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
                },
                resolve: {
                    tournament: function ($stateParams, $q, tournamentService, tournaments) {
                        var tournamentId = $stateParams.tournamentId;
                        for (var i = 0; i != tournaments.length; ++i) {
                            var tm = tournaments[i];
                            if (tm._id.$oid === tournamentId) {
                                return $q.when(tm);
                            }
                        }
                        return $q.when(null);
                    }
                }
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'static/views/auth/signup.html',
                controller: 'signupCtrl',
                data: {
                    ncyBreadcrumbLabel: 'Sign up',
                    ncyBreadcrumbParent: 'home',
                }
            });
    });