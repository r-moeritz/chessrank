angular.module('chessRank')
    .factory('sectionService', function ($resource) {
        return $resource('api/sections/:sectionId',
            { tournamentId: '@id' },
            { update: { method: 'PUT' } });
    });