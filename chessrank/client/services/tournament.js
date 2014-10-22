angular.module('chessRank')
    .factory('tournamentService', function ($resource) {
        return $resource('api/tournaments/:tournamentId',
            { tournamentId: '@id' },
            { update: { method: 'PUT' } });
    })
    .factory('tournamentEditHelper', function ($state, $modal, moment, sprintf, tournamentEditService) {
        return function () {
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

                        var i = scope.sections.indexOf(section);
                        scope.sections.splice(i);

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
    .service('tournamentEditService', function ($q, _, tournamentService, sectionService, dateUtil) {
        var _this = this;

        this._tournamentToAdd = {};
        this._sectionsToAdd = [];
        this._sectionsToUpdate = [];
        this._sectionsToDelete = [];

        this.reset = function () {
            _this._tournamentToAdd = {};
            _this._sectionsToAdd.splice(0);
            _this._sectionsToUpdate.splice(0);
            _this._sectionsToDelete.splice(0);
        }

        this.getTournamentToAdd = function () {
            return _this._tournamentToAdd;
        }

        this.addSection = function (section) {
            var found = _.find(_this._sectionsToAdd, function (s) {
                if ((s._id && section._id && s._id.$oid === section._id.$oid)
                    || s.fakeId === section.fakeId) {
                    return true;
                }
            });

            if (!found) {
                _this._sectionsToAdd.push(fixSectionData(section));
            }
        }

        this.updateSection = function (section) {
            var found = _.find(_this._sectionsToUpdate, function (s) {
                if ((s._id && section._id && s._id.$oid === section._id.$oid)
                    || s.fakeId === section.fakeId) {
                    return true;
                }
            });

            if (!found) {
                _this._sectionsToUpdate.push(fixSectionData(section));
            }
        }

        this.deleteSection = function (section) {
            var found = _.find(_this._sectionsToDelete, function (s) {
                if ((s._id && section._id && s._id.$oid === section._id.$oid)
                    || s.fakeId === section.fakeId) {
                    return true;
                }
            });

            if (!found) {
                _this._sectionsToDelete.push(section);
            }
        }

        this.getSectionsToAddOrUpdate = function () {
            return _this._sectionsToAdd.concat(_this._sectionsToUpdate);
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

            request.startDate = dateUtil.localDateToUtc(tournament.startDate);
            request.endDate = dateUtil.localDateToUtc(tournament.endDate);
            request.registrationFeeCurrencyId = tournament.currency.value;

            return request;
        }

        function fixSectionData(section) {
            section.timeControls = angular.fromJson(section.timeControls);
            section.startDate = dateUtil.localDateToUtc(section.startDate);
            section.endDate = dateUtil.localDateToUtc(section.endDate);
            section.registrationStartDate = dateUtil.localDateToUtc(section.registrationStartDate);
            section.registrationEndDate = dateUtil.localDateToUtc(section.registrationEndDate);
            return section;
        }

        function createSectionRequest(section) {
            request = angular.copy(section);

            delete request._id;
            delete request.ownerUserId;
            delete request.fakeId;

            request.tournamentId = section.tournamentId.$oid;
            request.registeredPlayerIds = _.map(section.registeredPlayerIds,
                function (playerId) { return playerId.$oid });

            return request;
        }

        function createUpsertRequests(tournamentId, insert) {
            var sections = insert ? _this._sectionsToAdd : _this._sectionsToUpdate;
            return _.map(sections, function (sec) {
                sec.tournamentId = tournamentId;
                return createSectionRequest(sec);
            });
        }

        this.submit = function (tournament) {
            var promises = [];

            if (tournament._id) {
                // Existing tournament
                var request = createTournamentRequest(tournament);
                var p = tournamentService.update({ tournamentId: tournament._id.$oid }, request).$promise;
                promises.push(p);

                var insertRequests = createUpsertRequests(tournament._id, true);
                promises = promises.concat(_.map(insertRequests, 
                    function (req) { return sectionService.save(req).$promise; }));

                var updateRequests = createUpsertRequests(tournament._id, false);
                promises = promises.concat(_.map(updateRequests,
                    function (req) { return sectionService.update(req).$promise; }));

                promises = promises.concat(_.map(_this._sectionsToDelete,
                    function (sec) { return sectionService.delete({ sectionId: sec._id.$oid }).$promise; }));
            } else {
                // New tournament
                var request = createTournamentRequest(tournament);
                promises.push(tournamentService.save(request).$promise.then(
                    function (data) {
                        var insertRequests = createUpsertRequests(data._id, true);
                        var insertPromises = _.map(insertRequests,
                            function (req) { return sectionService.save(req).$promise; });
                        return $q.all(insertPromises);
                    }));
            }

            return $q.all(promises);
        };

        return this;
    });