var constants = require('./constants.js');

function tc(moves, period, bonus, bonusType) {
    return {
        moves:     moves,
        period:    period,
        bonus:     bonus,
        bonusType: bonusType
    };
}

module.exports = {
    swissRounds: function(players) {
        return Math.ceil(Math.log(players) / Math.log(2));
    },

   stdTimeControls: [
        [tc(40,  90), tc(constants.tcMoves.suddenDeath, 30, 30, constants.tcBonus.increment)],
        [tc(40, 120), tc(constants.tcMoves.suddenDeath, 60,  5, constants.tcBonus.delay)],
        [tc(40, 115), tc(constants.tcMoves.suddenDeath, 60,  5, constants.tcBonus.delay)],
        [tc(constants.tcMoves.game, 120, 30, constants.tcBonus.increment)],
        [tc(constants.tcMoves.game, 120,  5, constants.tcBonus.delay)],
        [tc(constants.tcMoves.game, 115,  5, constants.tcBonus.delay)],
        [tc(constants.tcMoves.game,  90, 30, constants.tcBonus.increment)],
        [tc(constants.tcMoves.game,  90,  5, constants.tcBonus.delay)],
        [tc(constants.tcMoves.game,  60, 30, constants.tcBonus.increment)],
        [tc(constants.tcMoves.game,  60,  5, constants.tcBonus.delay)],
        [tc(30, 30), tc(constants.tcMoves.suddenDeath, 30, 5, constants.tcBonus.delay)],
        [tc(constants.tcMoves.game,  30,  5, constants.tcBonus.delay)],
        [tc(constants.tcMoves.game,  25,  5, constants.tcBonus.delay)],
        [tc(constants.tcMoves.game,  25,  3, constants.tcBonus.delay)],
        [tc(constants.tcMoves.game,  15,  3, constants.tcBonus.delay)],
        [tc(constants.tcMoves.game,  10,  3, constants.tcBonus.delay)],
        [tc(constants.tcMoves.game,  10)],
        [tc(constants.tcMoves.game,   5)],
        [tc(constants.tcMoves.game,   3,  2, constants.tcBonus.increment)]
    ],

    randomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    randomBool: function () {
        return Math.random() < .5;
    },

    randomDate: function (start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
};