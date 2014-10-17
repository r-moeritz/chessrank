'use strict'

angular.module('chessRank', ['ngResource', 'ui.router', 'ngAnimate', 'ncy-angular-breadcrumb',
    'ui.bootstrap', 'kendo.directives', 'formFor', 'formFor.bootstrapTemplates', 'toaster',
    'underscore', 'momentjs', 'sprintfjs', 'rmUtils.filters'])
    .config(function ($stateProvider, $urlRouterProvider, $breadcrumbProvider) {
        $breadcrumbProvider.setOptions({
            templateUrl: 'static/views/breadcrumb.html'
        });

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('a', {
                abstract: true,
                template: '<ui-view />',
                resolve: {
                    lookupsService: 'lookupsService',
                    lookups: function (lookupsService) {
                        return lookupsService.getLookups();
                    }
                }
            })
            .state('a.home', {
                url: '/',
                templateUrl: 'static/views/home.html',
                controller: 'homeCtrl',
                data: {
                    ncyBreadcrumbLabel: 'Home'
                }
            })
            .state('a.tournaments', {
                url: '/tournaments',
                views: {
                    '@': {
                        templateUrl: 'static/views/tournament/list.html',
                        controller: 'tournamentListCtrl'
                    }
                },
                data: {
                    ncyBreadcrumbLabel: 'Tournaments',
                    ncyBreadcrumbParent: 'a.home',
                },
                resolve: {
                    tournamentService: 'tournamentService',
                    tournaments: function (tournamentService) {
                        return tournamentService.query().$promise;
                    }
                },
            })
            .state('a.tournaments.details', {
                url: '/{tournamentId:[0-9a-fA-F]{24}}',
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
                    tournament: function ($stateParams, $q, tournaments, _) {
                        var res = _.find(tournaments,
                            function (tm) { return tm._id.$oid === $stateParams.tournamentId; });
                        return $q.when(res);
                    },
                    sectionService: 'sectionService',
                    sections: function ($stateParams, sectionService) {
                        return sectionService.query({ tournamentId: $stateParams.tournamentId });
                    }
                }
            })
            .state('a.tournaments.details.edit', {
                url: '/edit',
                views: {
                    '@': {
                        templateUrl: 'static/views/tournament/edit.html',
                        controller: 'tournamentEditCtrl'
                    }
                },
                data: {
                    ncyBreadcrumbLabel: 'Edit',
                    action: 'Edit'
                },
                resolve: {
                    sections: function (_, $q, tournament, sections, lookups) {
                        return $q.when(sections);
                    }
                }
            })
            .state('a.tournaments.details.edit.add_section', {
                url: '/add_section',
                views: {
                    '@': {
                        templateUrl: 'static/views/tournament/section/edit.html',
                        controller: 'sectionAddCtrl'
                    }
                },
                data: {
                    ncyBreadcrumbLabel: 'Add Section',
                    action: 'Add'
                },
                resolve: {
                    tournament: function ($q, tournament, lookups) {
                        return $q.when(tournament);
                    }
                }
            })
            .state('a.tournaments.details.edit.edit_section', {
                url: '/{sectionId:[0-9a-fA-F]{24}}',
                views: {
                    '@': {
                        templateUrl: 'static/views/tournament/section/edit.html',
                        controller: 'sectionEditCtrl'
                    }
                },
                data: {
                    ncyBreadcrumbLabel: '{{ section.name }}',
                    action: 'Edit'
                },
                resolve: {
                    section: function ($q, _, $stateParams, tournament, sections, lookups) {
                        var res = _.find(sections, function (sec) {
                            return sec._id.$oid === $stateParams.sectionId;
                        });
                        return $q.when(res);
                    }
                }
            })
            .state('a.tournaments.create', {
                url: '/create',
                views: {
                    '@': {
                        templateUrl: 'static/views/tournament/edit.html',
                        controller: 'tournamentEditCtrl',
                    }
                },
                data: {
                    ncyBreadcrumbLabel: 'Create Tournament',
                    action: 'Create'
                },
                resolve: {
                    tournament: function ($q) {
                        return $q.when({});
                    }
                }
            })
            .state('a.signup', {
                url: '/signup',
                templateUrl: 'static/views/auth/signup.html',
                controller: 'signupCtrl',
                data: {
                    ncyBreadcrumbLabel: 'Sign up',
                    ncyBreadcrumbParent: 'a.home',
                },
                resolve: {
                    lookups: function ($q, lookups) {
                        return $q.when(lookups);
                    }
                }
            });
    });