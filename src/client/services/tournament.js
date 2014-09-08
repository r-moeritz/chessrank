angular.module('chessRank')
    .factory('tournamentService', function ($resource) {
        return $resource('api/tournaments/:tournamentId',
            { tournamentId: '@id' },
            { update: { method: 'PUT' } });
    });