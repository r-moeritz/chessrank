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
        WCM: 0,
        WFM: 1,
        CM: 2,
        WIM: 3,
        FM: 4,
        WGM: 5,
        IM: 6,
        GM: 7
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
    });
