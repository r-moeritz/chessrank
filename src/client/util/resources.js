angular.module('chessRank')
    .factory('tournamentsResource', function ($resource) {
        return $resource('api/tournaments/:tournamentId',
            { tournamentId: '@id' },
            { update: { method: 'PUT' } });
    });