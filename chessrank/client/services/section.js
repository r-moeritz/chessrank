angular.module('chessRank')
    .factory('sectionService', function ($resource) {
        return $resource('api/sections/:sectionId',
            { tournamentId: '@id' },
            { update: { method: 'PUT' } });
    })
    .service('sectionEditService', function (sectionService) {
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

        this.submit = function (model) {
            model.timeControls = angular.fromJson(model.timeControls);

            if (model._id) {
                return sectionService.update({ sectionId: model._id.$oid }, model).$promise;
            }

            return sectionService.save(model).$promise;
        }

        return this;
    });