angular.module('chessRank')
    .factory('playerService', function ($resource) {
        return $resource('api/players/:playerId',
            { tournamentId: '@id' },
            { update: { method: 'PUT' } });
    });