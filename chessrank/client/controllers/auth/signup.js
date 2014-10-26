angular.module('chessRank')
    .controller('signupCtrl', function ($scope, $modal, moment, signupService, lookups, gender, fideTitle) {
        $scope.request = {
            gender: gender.male,
            federation: null
        };

        $scope.fideFederationList = lookups.fideFederations;
        $scope.fideTitleList = [
            { label: 'WCM', value: fideTitle.WCM },
            { label: 'WFM', value: fideTitle.WFM },
            { label: 'CM',  value: fideTitle.CM },
            { label: 'WIM', value: fideTitle.WIM },
            { label: 'FM',  value: fideTitle.FM },
            { label: 'WGM', value: fideTitle.WGM },
            { label: 'IM',  value: fideTitle.IM },
            { label: 'GM',  value: fideTitle.GM }
        ];

        $scope.datePickerOptions = {
            start: 'year',
            format: 'dd MMM yyyy',
            min: moment().subtract(120, 'years').toDate(),
            max: moment().subtract(4, 'years').toDate()
        };

        $scope.signupComplete = function () {
            signupService.confirmationEmail = $scope.request.email;

            $modal.open({
                templateUrl: 'static/views/auth/signup-confirm.html',
                controller: 'signupConfirmCtrl'
            });
        }

        $scope.signupFailed = function (error) {
            $scope.signupError = error.data.message || 'Unknown error';
        }

        $scope.clearError = function () {
            $scope.signupError = null
        }
    })
    .controller('signupConfirmCtrl', function ($scope, $modalInstance, $state, signupService) {
        $scope.email = signupService.confirmationEmail;

        $scope.ok = function() {
            $modalInstance.close();
            $state.go('a.home');
        }
    });