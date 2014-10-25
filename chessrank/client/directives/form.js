angular.module('chessRank')
    .directive('datePickerField', function ($log, FieldHelper) {
        return {
            require: '^formFor',
            restrict: 'E',
            templateUrl: 'static/views/form/datePicker.html',
            scope: {
                attribute: '@',
                disable: '=',
                help: '@?',
                options: '=',
                time: '='
            },
            link: function ($scope, $element, $attributes, formForController) {
                if (!$scope.attribute) {
                    $log.error('Missing required field "attribute"');
                    return;
                }

                FieldHelper.manageLabel($scope, $attributes);
                FieldHelper.manageFieldRegistration($scope, $attributes, formForController);
            }
        }
    })
    .directive('multiSelectField', function ($log, FieldHelper) {
        return {
            require: '^formFor',
            restrict: 'E',
            templateUrl: 'static/views/form/multiSelect.html',
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

                if (!$scope.options) {
                    $log.error('Missing required field "options"');
                    return;
                }

                FieldHelper.manageLabel($scope, $attributes);
                FieldHelper.manageFieldRegistration($scope, $attributes, formForController);
            }
        }
    })
    .directive('autoCompleteField', function ($log, FieldHelper) {
        return {
            require: '^formFor',
            restrict: 'E',
            templateUrl: 'static/views/form/autoComplete.html',
            scope: {
                attribute: '@',
                disable: '=',
                help: '@?',
                options: '=',
                editable: '=',
                placeholder: '@?'
            },
            link: function ($scope, $element, $attributes, formForController) {
                if (!$scope.attribute) {
                    $log.error('Missing required field "attribute"');
                    return;
                }

                if (!$scope.options) {
                    $log.error('Missing required field "dataSource"');
                    return;
                }

                FieldHelper.manageLabel($scope, $attributes);
                FieldHelper.manageFieldRegistration($scope, $attributes, formForController);
            }
        }
    });