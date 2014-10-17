angular.module('chessRank')
    .filter('playSystem', function (playSystem) {
        return function (systemId) {
            switch (systemId) {
                case playSystem.roundRobin:
                    return 'Round Robin';

                case playSystem.doubleRoundRobin:
                    return 'Double Round Robin';

                case playSystem.swiss:
                    return 'Swiss';

                default:
                    return systemId;
            }
        }
    })
    .filter('tieBreak', function (tieBreak) {
        return function (tieBreakId) {
            switch (tieBreakId) {
                case tieBreak.neustadl:
                    return 'Neustadl';

                case tieBreak.buchholz:
                    return 'Buchholz';

                case tieBreak.median:
                    return 'Median';

                case tieBreak.modifiedMedian:
                    return 'Modified Median';

                default:
                    return tieBreakId;
            }
        }
    })
    .filter('timeControl', function (tcMoves, tcBonus, sprintf) {
        return function (tc) {
            var bonusType = (tc.bonusType === tcBonus.increment) ? 'inc' : 'd';

            var moves;
            if (tc.moves < 1) {
                moves = (tc.moves === tcMoves.game) ? 'G' : 'SD';
            } else {
                moves = tc.moves.toString();
            }

            return sprintf('%s/%d %s/%d', moves, tc.period, bonusType, tc.bonus);
        }
    });