angular.module('chessRank')
    .filter('ratingType', function (ratingType) {
        return function (ratingTypeId) {
            switch (ratingTypeId) {
                case ratingType.fide:
                    return 'FIDE';

                case ratingType.federation:
                    return 'Federation';

                default:
                    return ratingTypeId;
            }
        }
    });