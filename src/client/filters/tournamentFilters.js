angular.module('chessRank')
    .filter('tournamentRounds', function () {
        return function (rounds) {
            return angular.isNumber(rounds) && rounds < 1 ? 'N/A' : rounds;
        }
    })
    .filter('tournamentSystem', function (playSystem) {
        return function (system) {
            if (angular.isNumber(system)) {
                switch (system) {
                    case playSystem.roundRobin:
                        return 'Round Robin';

                    case playSystem.doubleRoundRobin:
                        return 'Dbl Round Robin';

                    case playSystem.swiss:
                        return 'Swiss';

                    default:
                        return system;
                }
            } else {
                return system;
            }
        }
    });