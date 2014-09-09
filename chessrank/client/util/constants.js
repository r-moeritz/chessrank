angular.module('chessRank')
    .constant('gender', {
        male: 0,
        female: 1
    })
    .constant('playSystem', {
        roundRobin: 0,
        doubleRoundRobin: 1,
        swiss: 2
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
        increment: 0,
        delay: 1
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
    });