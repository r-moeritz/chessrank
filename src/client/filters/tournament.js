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
    .filter('tournamentSystem', function (playSystemFilter) {
        return function (tournament) {
            var systemId = null;
            for (var i = 0; i != tournament.sections.length; ++i) {
                var section = tournament.sections[i];
                if (systemId !== null && systemId !== section.playSystem) {
                    return 'Section Specific';
                }
                systemId = section.playSystem;
            }
            return playSystemFilter(systemId);
        }
    });