'use strict'

angular.module('chessRank', ['ngResource', 'ui.router', 'ncy-angular-breadcrumb',
    'ui.bootstrap', 'kendo.directives', 'rmUtils.filters'])
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
    });