angular.module('chessRank')
    .service('scoringUtil', function (gameResult) {
        this.points = function(gameRes) {
            var result = [null, null];

            switch (gameRes) {
                case gameResult.blackWins:
                case gameResult.whiteForfeits:
                    result = [0, 1];
                    break;

                case gameResult.whiteWins:
                case gameResult.blackForfeits:
                    result = [1, 0];
                    break;

                case gameResult.draw:
                    result = [0.5, 0.5];
                    break;

                case gameResult.bothForfeit:
                    result = [0, 0];
                    break;
            }

            return result;
        }

        return this;
    });