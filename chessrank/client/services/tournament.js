angular.module('chessRank')
    .factory('tournamentService', function ($resource) {
        return $resource('api/tournaments/:tournamentId',
            { tournamentId: '@id' },
            { update: { method: 'PUT' } });
    })
    .factory('tournamentEditHelper', function (_, $state, $modal, moment, sprintf, tournamentEditService, rmArrayUtil) {
        return function (tournamentId) {
            tournamentEditService.setTournamentId(tournamentId);

            this.attach = function (scope, lookups) {
                scope.fideFederationList = lookups.fideFederations;

                scope.datePickerOptions = {
                    start: 'year',
                    format: 'dd MMM yyyy',
                    min: moment().subtract(6, 'months').toDate(),
                    max: moment().add(6, 'months').toDate()
                };

                scope.editComplete = function () {
                    tournamentEditService.reset();
                    $state.go('^', null, { reload: true });
                }

                scope.editFailed = function (error) {
                    scope.editError = error.data.message || 'Unknown error';
                }

                scope.clearError = function () {
                    scope.editError = null
                }

                scope.cancel = function () {
                    tournamentEditService.reset();
                    $state.go('^');
                }

                scope.confirmDeleteSection = function (section) {
                    scope.model = {
                        title: 'Confirm delete',
                        description: sprintf('Are you sure you want to delete the %s?',
                            section.name)
                    }

                    var inst = $modal.open({
                        templateUrl: 'static/views/yesno.html',
                        size: 'sm',
                        scope: scope
                    });

                    inst.result.then(function () {
                        tournamentEditService.deleteSection(section);

                        var i = rmArrayUtil.indexOf(scope.sections,
                            function (sec) {
                                return (sec._id && section._id
                                    && sec._id.$oid === section._id.$oid)
                                || (sec.fakeId && section.fakeId && sec.fakeId === section.fakeId);
                            });
                        scope.sections.splice(i, 1);

                        if (section._id) {
                            $('#section_' + section._id.$oid).fadeOut();
                        } else {
                            $('#section_' + section.fakeId).fadeOut();
                        }
                    });
                };
            };
        }
    })
    .service('tournamentEditService', function ($q, _, tournamentService, sectionService,
                                                moment, baseTypeConverter, ratingType) {
        var _this = this;

        this._newTournamentTemplate = { ratingType: ratingType.fide };
        this._tournamentToAdd = angular.copy(this._newTournamentTemplate);
        this._sectionsToAdd = [];
        this._tournamentId = null;

        this.reset = function () {
            _this._tournamentId = null;
            _this._tournamentToAdd = angular.copy(_this._newTournamentTemplate);
            _this._sectionsToAdd.splice(0);
        }

        this.setTournamentId = function (tournamentId) {
            _this._tournamentId = tournamentId;
        }

        this.getTournamentToAdd = function () {
            return _this._tournamentToAdd;
        }

        this.getSectionsToAdd = function () {
            return _this._sectionsToAdd;
        }

        this.addSection = function (section) {
            if (_this._tournamentId) {
                // Existing tournament
                fixEditedSection(section);
                var request = createSectionRequest(section, _this._tournamentId);
                return sectionService.save(request).$promise;
            }

            var found = _.find(_this._sectionsToAdd, function (s) {
                if ((s._id && section._id && s._id.$oid === section._id.$oid)
                    || (s.fakeId && section.fakeId && s.fakeId === section.fakeId)) {
                    return true;
                }
            });

            fixEditedSection(section);
            if (!found) {
                _this._sectionsToAdd.push(section);
            }

            return $q.when(true);
        }

        this.updateSection = function (section) {
            fixEditedSection(section);
            var request = createSectionRequest(section);
            return sectionService.update({ sectionId: section._id.$oid }, request).$promise;
        }

        this.deleteSection = function (section) {
            if (section._id) {
                return sectionService.delete({ sectionId: section._id.$oid }).$promise;
            }
        }

        this.validationRules = {
            name: {
                required: true,
                minlength: 2,
                maxlength: 50
            },
            location: {
                required: true,
                minlength: 2,
                maxlength: 50
            },
            startDate: {
                required: true
            },
            endDate: {
                required: true
            },
            currency: {
                required: true
            },
            ratingType: {
                required: true
            },
            federation: {
                custom: function (value, model) {
                    var deferred = $q.defer();

                    if (model.ratingType == ratingType.federation && !value) {
                        deferred.reject('Must select a federation if using federation rating');
                    } else {
                        deferred.resolve();
                    }

                    return deferred.promise;
                }
            }
        };

        function createTournamentRequest(tournament) {
            var request = angular.copy(tournament);
            var converter = new baseTypeConverter();

            delete request._id;
            delete request.ownerUserId;
            delete request.currency;

            request.startDate = converter.jsDateToBsonUtcDropTime(tournament.startDate);
            request.endDate = converter.jsDateToBsonUtcDropTime(tournament.endDate);
            request.registrationFeeCurrencyId = tournament.currency.value;

            return JSON.stringify(request);
        }

        function fixEditedSection(section) {
            var converter = new baseTypeConverter();

            section.timeControls = angular.fromJson(section.timeControls);
            section.startDate = converter.jsDateToBsonUtcDropTime(section.startDate);
            section.endDate = converter.jsDateToBsonUtcDropTime(section.endDate);
            section.registrationStartDate = converter.jsDateToBsonUtcDropTime(section.registrationStartDate);
            section.registrationEndDate = converter.jsDateToBsonUtcDropTime(section.registrationEndDate);
            _.each(section.roundData, function (rd) {
                rd.startTime = converter.momentToBsonDate(moment(rd.startTime).utc());
            });
        }

        function createSectionRequest(section, tournamentId) {
            var request = angular.copy(section);

            delete request._id;
            delete request.ownerUserId;
            delete request.fakeId;

            request.tournamentId = tournamentId || section.tournamentId;

            return JSON.stringify(request);
        }

        this.submit = function (tournament) {
            var request = createTournamentRequest(tournament);
            return tournament._id
                ? tournamentService.update({ tournamentId: tournament._id.$oid }, request).$promise
                : tournamentService.save(request).$promise.then(
                    function (data) {
                        var insertRequests = _.map(_this._sectionsToAdd, function (sec) {
                            return createSectionRequest(sec, data._id);
                        });
                        var insertPromises = _.map(insertRequests,
                            function (req) { return sectionService.save(req).$promise; });
                        return $q.all(insertPromises);
                });
        };

        return this;
    });