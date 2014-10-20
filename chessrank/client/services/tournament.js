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

        function createRequest(tournament) {
            var request = angular.copy(tournament);

            delete request._id;
            delete request.ownerUserId;

            request.startDate = dateUtil.localDateToUtc(tournament.startDate);
            request.endDate = dateUtil.localDateToUtc(tournament.endDate);

            return request;
        }

        this.submit = function (tournament) {
            var request = createRequest(tournament)

            if (tournament._id) {
                return tournamentService.update({ tournamentId: tournament._id.$oid }, request).$promise;
            }
            
            return tournamentService.save(request).$promise;
        }

        return this;
    });