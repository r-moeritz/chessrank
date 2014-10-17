angular.module('chessRank')
    .factory('sectionService', function ($resource) {
        return $resource('api/sections/:sectionId',
            { tournamentId: '@id' },
            { update: { method: 'PUT' } });
    })
    .service('sectionEditService', function (_, sectionService) {
        this.validationRules = {
            name: {
                required: true,
                minlength: 2,
                maxlength: 50
            },
            playSystem: {
                required: true
            },
            timeControls: {
                required: true
            },
            rounds: {
                required: true
            },
            maxPlayers: {
                required: true
            },
            chiefArbiter: {
                required: true
            },
            provisionalRating: {
                required: true
            }
        };

        function tc(moves, period, bonus, bonusType) {
            return {
                moves: moves,
                period: period,
                bonus: bonus,
                bonusType: bonusType
            };
        }

        function createRequest(section) {
            request = angular.copy(section);

            delete request._id;
            request.timeControls = angular.fromJson(section.timeControls);
            request.tournamentId = section.tournamentId.$oid;
            request.registeredPlayerIds = _.map(section.registeredPlayerIds,
                function (playerId) { return playerId.$oid });

            return request;
        }

        this.submit = function (section) {
            var request = createRequest(section);
            if (section._id) {
                return sectionService.update({ sectionId: section._id.$oid }, request).$promise;
            }

            return sectionService.save(request).$promise;
        }

        return this;
    });