angular.module('chessRank')
    .directive('datepickerField',
    function (FieldHelper) {
        return {
            require: '^formFor',
            restrict: 'E',
            templateUrl: 'static/views/form/datepicker.html',
            scope: {
                attribute: '@',
                disable: '=',
                help: '@?',
                options: '='
            },
            link: function ($scope, $element, $attributes, formForController) {
                if (!$scope.attribute) {
                    $log.error('Missing required field "attribute"');
                    return;
                }

                $scope.label = FieldHelper.getLabel($attributes, $scope.attribute);
                FieldHelper.manageFieldRegistration($scope, formForController);
            }
        }
    });