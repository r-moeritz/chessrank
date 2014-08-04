'use strict'

angular.module('chessRank', ['ngResource', 'ui.router', 'ncy-angular-breadcrumb', 'ui.bootstrap'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
            .otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'static/views/home.html',
                controller: 'homeCtrl',
                data: {
                    ncyBreadcrumbLabel: 'Home'
                }
            });
    })
    .factory('tournamentsResource', function ($resource) {
        return $resource('api/tournaments/:id', { id: '@id' }, { update: { method: 'PUT' } });
    });
