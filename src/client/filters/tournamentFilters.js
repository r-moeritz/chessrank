angular.module('chessRank')
    .filter('tournamentRounds', function () {
        return function (tournament) {
            var rounds = null;
            for (var i = 0; i != tournament.sections.length; ++i) {
                var section = tournament.sections[i];
                if (rounds !== null && rounds !== section.rounds) {
                    return 'Section Specific';
                }
                rounds = section.rounds;
            }

            return angular.isNumber(rounds) && rounds < 1 ? 'N/A' : rounds;
        }
    })
    .filter('tournamentSystem', function (playSystem) {
        return function (tournament) {
            var system = null;
            for (var i = 0; i != tournament.sections.length; ++i) {
                var section = tournament.sections[i];
                if (system !== null && system !== section.playSystem) {
                    return 'Section Specific';
                }
                system = section.playSystem;
            }

            if (angular.isNumber(system)) {
                switch (system) {
                    case playSystem.roundRobin:
                        return 'Round Robin';

                    case playSystem.doubleRoundRobin:
                        return 'Double Round Robin';

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