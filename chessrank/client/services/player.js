angular.module('chessRank')
    .factory('playerService', function ($resource) {
        return $resource('api/players/:playerId',
            { playerId: '@id' },
            { update: { method: 'PUT' } });
    })
    .service('playerLookupService', function ($q, _, playerService) {
        var _this = this;

        this._players = [];

        this.findPlayers = function (playerIds) {
            if (_this.promise) {
                return _this.promise;
            }

            var players = _.filter(_this._players, function (p) {
                return _.contains(playerIds, p._id.$oid);
            });

            if (players && players.length === playerIds.length) {
                return $q.when(players);
            }

            _this.promise = playerService.query().$promise.then(
                function (playerList) {
                    _this._players = playerList;
                    _this.promise = null;

                    var players = _.filter(_this._players, function (p) {
                        return _.contains(playerIds, p._id.$oid);
                    });
                    return players;
                });
            return _this.promise;
        };

        return this;
    });