angular.module('underscore', [])
    .factory('_', function () {
        return window._;
    });

angular.module('momentjs', [])
    .factory('moment', function () {
        return window.moment;
    });

angular.module('sprintfjs', [])
    .factory('sprintf', function () {
        return window.sprintf;
    });