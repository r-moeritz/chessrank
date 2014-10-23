angular.module('chessRank')
    .filter('fideTitle', function (fideTitle) {
        return function (titleId) {
            switch (titleId) {
                case fideTitle.WCM:
                    return 'WCM';

                case fideTitle.WFM:
                    return 'WFM';

                case fideTitle.CM:
                    return 'CM';

                case fideTitle.WIM:
                    return 'WIM';

                case fideTitle.FM:
                    return 'FM';

                case fideTitle.WGM:
                    return 'WGM';

                case fideTitle.IM:
                    return 'IM';

                case fideTitle.GM:
                    return 'GM';

                default:
                    return null;
            }
        }
    })