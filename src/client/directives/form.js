angular.module('chessRank').directive('datepickerField',
    function () {
        return {
            require: '^formFor',
            restrict: 'E',
            templateUrl: 'static/views/form/datepicker.html',
            scope: {
                attribute: '@',
                disable: '=',
                help: '@?',
                options: '=',
                label: '@'
            },
            link: function ($scope, $element, $attributes, formForController, FieldHelper) {
                if (!$scope.attribute) {
                    $log.error('Missing required field "attribute"');
                    return;
                }

                //$scope.label = FieldHelper.getLabel($attributes, $scope.attribute);
                //FieldHelper.manageFieldRegistration($scope, formForController);

                $scope.model = formForController.registerFormField($scope, $scope.attribute);
            }
        }
    });