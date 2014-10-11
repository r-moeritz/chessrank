﻿angular.module('chessRank')
    .controller('signupCtrl', function ($scope, $modal, moment, signupService, lookups) {
        $scope.request = { gender: '0' };

        $scope.fideFederationList = lookups.fideFederations;
        $scope.fideTitleList = [
            { label: 'WCM', value: 0 },
            { label: 'WFM', value: 1 },
            { label: 'CM',  value: 2 },
            { label: 'WIM', value: 3 },
            { label: 'FM',  value: 4 },
            { label: 'WGM', value: 5 },
            { label: 'IM',  value: 6 },
            { label: 'GM',  value: 7 }
        ];

        $scope.datePickerOptions = {
            start: 'year',
            format: 'dd MMM yyyy',
            min: moment().utc().subtract(120, 'years').toDate(),
            max: moment().utc().subtract(4, 'years').toDate()
        };

        $scope.signupComplete = function () {
            signupService.confirmationEmail = $scope.request.email;

            $modal.open({
                templateUrl: 'static/views/auth/signup-confirm.html',
                controller: 'signupConfirmCtrl'
            });
        }

        $scope.signupFailed = function (error) {
            $scope.signupError = error.data.message;
        }

        $scope.clearError = function () {
            $scope.signupError = null
        }
    })
    .controller('signupConfirmCtrl', function ($scope, $modalInstance, $state, signupService) {
        $scope.email = signupService.confirmationEmail;

        $scope.ok = function() {
            $modalInstance.close();
            $state.go('home');
        }
    });