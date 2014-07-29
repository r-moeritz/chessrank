'use strict'

angular.module('chessRank', ['ngResource', 'ui.router', 'ncy-angular-breadcrumb', 'ui.bootstrap'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
            .otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                data: {
                    ncyBreadcrumbLabel: 'Home'
                },
                views: {
                    '': {
                        templateUrl: 'static/views/home.html',
                        controller: 'homeCtrl',
                    },
                    'currentTournaments@home': {
                        templateUrl: 'static/views/tournament/list.html'
                    }
                }
            });
    })
    .factory('tournaments', function ($resource) {
        return $resource('api/tournaments/:id', { id: '@id' }, { update: { method: 'PUT' } });
    });
