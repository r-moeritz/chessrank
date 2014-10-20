angular.module('chessRank')
    .factory('playerService', function ($resource) {
        return $resource('api/players/:playerId',
            { playerId: '@id' },
            { update: { method: 'PUT' } });
    });