angular.module('chessRank')
    .service('dateUtil', function () {
        this.localDateToUtc = function (date) {
            var y = date.getFullYear();
            var m = date.getMonth();
            var d = date.getDate();

            return new Date(Date.UTC(y, m, d));
        }

        return this;
    });