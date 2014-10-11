angular.module('chessRank')
    .factory('tournamentService', function ($resource) {
        return $resource('api/tournaments/:tournamentId',
            { tournamentId: '@id' },
            { update: { method: 'PUT' } });
    })
    .service('tournamentEditService', function (tournamentService) {
        this.validationRules = {
            name: {
                required: true,
                minlength: 2,
                maxlength: 50
            },
            location: {
                required: true,
                minlength: 2,
                maxlength: 50
            }
        };

        this.submit = function (model) {
            if (model._id) {
                return tournamentService.update({ tournamentId: model._id.$oid }, model).$promise;
            }
            
            return tournamentService.save(model).$promise;
        }

        return this;
    });