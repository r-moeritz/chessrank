angular.module('chessRank')
    .factory('tournamentService', function ($resource) {
        return $resource('api/tournaments/:tournamentId',
            { tournamentId: '@id' },
            { update: { method: 'PUT' } });
    })
    .factory('tournamentEditHelper', function (_, $state, $modal, moment, sprintf, tournamentEditService, rmArrayUtil) {
        return function (tournamentId) {
            tournamentEditService.setTournamentId(tournamentId);

            this.attach = function (scope) {
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

                scope.confirmDeleteSection = function () {
                    var section = this.item;

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
    .service('tournamentEditService', function ($q, _, tournamentService, sectionService, rmDateUtil) {
        var _this = this;

        this._tournamentToAdd = {};
        this._sectionsToAdd = [];
        this._tournamentId = null;

        this.reset = function () {
            _this._tournamentId = null;
            _this._tournamentToAdd = {};
            _this._sectionsToAdd.splice(0);
        }

        this.setTournamentId = function (tournamentId) {
            return _this._tournamentId = tournamentId;
        }

        this.getSectionsToAdd = function () {
            return _this._sectionsToAdd;
        }

        this.setExistingTournament = function() {
            _this._existingTournament = true;
        }

        this.addSection = function (section) {
            if (_this._tournamentId) {
                // Existing tournament
                fixSectionData(section);
                var request = createSectionRequest(section, _this._tournamentId);
                return sectionService.save(request).$promise;
            }

            var found = _.find(_this._sectionsToAdd, function (s) {
                if ((s._id && section._id && s._id.$oid === section._id.$oid)
                    || (s.fakeId && section.fakeId && s.fakeId === section.fakeId)) {
                    return true;
                }
            });

            if (!found) {
                _this._sectionsToAdd.push(fixSectionData(section));
            }

            return $q.when(true);
        }

        this.updateSection = function (section) {
            fixSectionData(section);
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
            }
        };

        function createTournamentRequest(tournament) {
            var request = angular.copy(tournament);

            delete request._id;
            delete request.ownerUserId;
            delete request.currency;

            request.startDate = rmDateUtil.localDateToUtc(tournament.startDate);
            request.endDate = rmDateUtil.localDateToUtc(tournament.endDate);
            request.registrationFeeCurrencyId = tournament.currency.value;

            return request;
        }

        function fixSectionData(section) {
            section.timeControls = angular.fromJson(section.timeControls);
            section.startDate = rmDateUtil.localDateToUtc(section.startDate);
            section.endDate = rmDateUtil.localDateToUtc(section.endDate);
            section.registrationStartDate = rmDateUtil.localDateToUtc(section.registrationStartDate);
            section.registrationEndDate = rmDateUtil.localDateToUtc(section.registrationEndDate);
            return section;
        }

        function createSectionRequest(section, tournamentId) {
            request = angular.copy(section);

            delete request._id;
            delete request.ownerUserId;
            delete request.fakeId;

            request.tournamentId = tournamentId || section.tournamentId.$oid;
            request.registeredPlayerIds = _.map(section.registeredPlayerIds,
                function (playerId) { return playerId.$oid });

            return request;
        }

        this.submit = function (tournament) {
            var request = createTournamentRequest(tournament);
            return tournament._id
                ? tournamentService.update({ tournamentId: tournament._id.$oid }, request).$promise
                : tournamentService.save(request).$promise.then(
                    function (data) {
                        var insertRequests = _.map(_this._sectionsToAdd, function (sec) {
                            return createSectionRequest(sec, tournamentId);
                        });
                        var insertPromises = _.map(insertRequests,
                            function (req) { return sectionService.save(req).$promise; });
                        return $q.all(insertPromises);
                });
        };

        return this;
    });