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
    });
