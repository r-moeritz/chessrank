function tc(moves, period, bonus, bonusType) {
    return {
        moves: moves,
        period: period,
        bonus: bonus,
        bonusType: bonusType
    };
}

angular.module('chessRank')
    .constant('gender', {
        male: 1,
        female: 2
    })
    .constant('playSystem', {
        roundRobin: 1,
        doubleRoundRobin: 2,
        swiss: 3
    })
    .constant('tieBreak', {
        neustadl: 0,
        buchholz: 1,
        median: 2,
        modifiedMedian: 3
    })
    .constant('tcMoves', {
        game: 0,
        suddenDeath: -1
    })
    .constant('tcBonus', {
        increment: 1,
        delay: 2
    })
    .constant('authEvent', {
        loginSuccess: 0,
        loginFailed: 1,
        logoutSuccess: 2,
        sessionTimeout: 3,
        notAuthenticated: 4,
    })
    .constant('fideTitle', {
        WCM: 1,
        WFM: 2,
        CM: 3,
        WIM: 4,
        FM: 5,
        WGM: 6,
        IM: 7,
        GM: 8
    })
    .constant('userStatus', {
        unconfirmed: 0,
        active: 1,
        disabled: 2
    })
    .constant('sectionRegistrationAction', {
        register: 0,
        unregister: 1
    })
    .constant('ratingType', {
        fide: 1,
        federation: 2
    })
    .constant('colour', {
        black: -1,
        none: 0,
        white: 1
    })
    .constant('sectionOwnerAction', {
        updateSection: 0,
        pairRound: 1,
        captureResults: 2,
        confirmRegistrations: 3
    })
    .constant('gameResult', {
        blackWins: 0,
        whiteWins: 1,
        draw: 2,
        blackForfeits: 3,
        whiteForfeits: 4,
        bothForfeit: 5,
        bye: 6
    })
    .constant('roundStatus', {
        unpaired: 0,
        paired: 1,
        completed: 2
    });
