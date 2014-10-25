angular.module('chessRank')
    .factory('baseTypeConverter', function (moment) {
        return function () {
            var _this = this;

            this.bsonDateToJs = function (bsonDate) {
                return new Date(bsonDate.$date);
            }

            this.bsonDateToMoment = function (bsonDate) {
                return moment(bsonDate.$date);
            }

            this.jsDateToBson = function (jsDate) {
                return { '$date': jsDate.getTime() };
            }

            this.momentToBsonDate = function (mom) {
                return _this.jsDateToBson(mom.toDate());
            }

            this.nowToBsonDate = function () {
                return _this.momentToBsonDate(moment());
            }

            this.objectIdToString = function (objectId) {
                return objectId.$oid;
            }

            this.stringToObjectId = function (str) {
                return { '$oid': str };
            }

            this.jsDateToUtcDropTime = function (jsDate) {
                var y = jsDate.getFullYear();
                var m = jsDate.getMonth();
                var d = jsDate.getDate();
                return new Date(Date.UTC(y, m, d));
            }

            this.jsDateToBsonUtcDropTime = function (jsDate) {
                var jsDateUtc = _this.jsDateToUtcDropTime(jsDate);
                return _this.jsDateToBson(jsDateUtc);
            }
        }
    });