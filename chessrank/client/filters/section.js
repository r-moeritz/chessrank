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
            return (tc.moves > 0)
                ? sprintf('%d/%d', tc.moves, tc.period)
                : sprintf('%s/%d %s/%d',
                    (tc.moves === tcMoves.game) ? 'G' : 'SD',
                    tc.period,
                    (tc.bonusType === tcBonus.increment) ? 'inc' : 'd',
                    tc.bonus || 0);
        }
    });