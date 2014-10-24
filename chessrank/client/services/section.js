angular.module('chessRank')
    .factory('sectionService', function ($resource) {
        return $resource('api/sections/:sectionId',
            { sectionId: '@id' },
            { update: { method: 'PUT' } });
    })
    .factory('sectionEditHelper', function ($state, _, moment, playSystem, tieBreak, timeControlFilter) {
        return function () {
            this.attach = function (scope, tournament, lookups) {
                scope.datePickerOptions = {
                    start: 'year',
                    format: 'dd MMM yyyy',
                    min: moment().subtract(6, 'months').toDate(),
                    max: moment().add(6, 'months').toDate()
                };

                scope.currency = _.find(lookups.currencies,
                    function (cur) {
                        return cur.value === tournament.registrationFeeCurrencyId;
                    });

                scope.playSystemOptions = [
                    { label: 'Round Robin', value: playSystem.roundRobin },
                    { label: 'Double Round Robin', value: playSystem.doubleRoundRobin },
                    { label: 'Swiss', value: playSystem.swiss }
                ];

                scope.tieBreakOptions = {
                    dataTextField: 'label',
                    dataValueField: 'value',
                    dataSource: [
                        { label: 'Neustadl', value: tieBreak.neustadl },
                        { label: 'Buchholz', value: tieBreak.buchholz },
                        { label: 'Median', value: tieBreak.median },
                        { label: 'Modified Median', value: tieBreak.modifiedMedian }
                    ]
                };

                scope.timeControlOptions = _.map(lookups.stdTimeControls,
                    function (tc) {
                        return {
                            value: angular.toJson(tc),
                            label: _.map(tc, function (ctrl) {
                                return timeControlFilter(ctrl);
                            }).join(', ')
                        }
                    });

                scope.editComplete = function () {
                    $state.go('^', null, { reload: true });
                }

                scope.editFailed = function (error) {
                    scope.editError = error.data.message || 'Unknown error';
                }

                scope.clearError = function () {
                    scope.editError = null
                }
            };
        };
    })
    .service('sectionEditService', function ($q, tournamentEditService) {
        this.validationRules = {
            name: {
                required: true,
                minlength: 2,
                maxlength: 50
            },
            playSystem: {
                required: true
            },
            timeControls: {
                required: true
            },
            rounds: {
                required: true
            },
            maxPlayers: {
                required: true
            },
            chiefArbiter: {
                required: true
            },
            provisionalRating: {
                required: true
            },
            startDate: {
                required: true
            },
            endDate: {
                required: true
            },
            registrationStartDate: {
                required: true
            },
            registrationEndDate: {
                required: true
            },
            registrationFee: {
                required: true
            },
            tieBreaks: {
                required: true
            }
        };

        function tc(moves, period, bonus, bonusType) {
            return {
                moves: moves,
                period: period,
                bonus: bonus,
                bonusType: bonusType
            };
        }

        this.submit = function (section) {
            return section._id
                ? tournamentEditService.updateSection(section)
                : tournamentEditService.addSection(section);
        }

        return this;
    });