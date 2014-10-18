import json
import tornado.web
import pymongo
import bson.json_util
import dateutil.parser
import requesthandlers.api
import util

from urllib.parse import urlunsplit
from tornado import gen
from bson.objectid import ObjectId
from util.enums import SectionRegistrationAction
from validation.section import SectionRegistrationValidator, SectionUpdateValidator

class SectionHandler(requesthandlers.api.ApiHandler):
    @gen.coroutine
    def get(self, id):
        # Get optional query args
        query  = self.get_argument('query',  None)
        sort   = self.get_argument('sort',   'name')
        desc   = self.get_argument('desc',   False)
        offset = self.get_argument('offset', 0)
        limit  = self.get_argument('limit',  None)
        tournamentId = self.get_argument('tournamentId', None)

        # Convert query args where necessary
        sortdir = pymongo.DESCENDING if desc == 'true' else pymongo.ASCENDING
        offset  = int(offset)
        limit   = int(limit) if limit else None

        # Build query spec
        spec = {}
        if id:
            spec = { '_id': { '$in': [ObjectId(id)] } }
        elif tournamentId:
            spec = { 'tournamentId': ObjectId(tournamentId) }
        elif query:
            spec = { 'name': { '$regex': query, '$options': 'i' } }

        # Execute query
        db = self.settings['db']
        sections = yield db.sections.find(spec).sort(sort, sortdir).skip(offset).to_list(limit)
        if not sections:
            raise tornado.web.HTTPError(404)

        # Write response
        self.write(bson.json_util.dumps(sections[0] if id else sections))
        self.set_header('Content-Type', 'application/json')

    @util.authenticated_async
    @gen.coroutine
    def put(self, id):
        request = json.loads(self.request.body.decode('utf-8'))
        db = self.settings['db']
        spec = { '_id': ObjectId(id) }
        
        # 1. Retrieve section data
        section = yield db.sections.find_one(spec)
        if not section:
            raise tornado.web.HTTPError(404, 'Section does not exist: {0}'.format(id))

        # 2. Retrieve parent tournament data
        tournament = yield db.tournaments.find_one({ '_id': section['tournamentId'] })
        if not tournament:
            # TODO: Log error
            raise tornado.web.HTTPError(500)

        # 3. Check whether user is tournament owner
        if tournament['ownerUserId'] == self.current_user:
            # Tournament owner can perform arbitrary update

            # 4a. Validate update request
            validator = SectionUpdateValidator(request)
            result = validator.validate()
            if not result[0]:
                raise tornado.web.HTTPError(400, result[1])

            # 5a. Massage request data
            self._format_owner_request(request)
            
            # 6a. Perform update
            db.sections.update(spec, request)
        else:
            # Update requested by other user: only allow registration

            # 4b. Validate registration request
            validator = SectionRegistrationValidator(request)
            result = validator.validate()
            if not result[0]:
                raise tornado.web.HTTPError(400, result[1])

            action = request['action']
            registeredPlayerIds = section['registeredPlayerIds']

            user = yield db.users.find_one({ '_id': self.current_user })
            if not user:
                # TODO: Log error
                raise tornado.web.HTTPError(500)
            playerId = user['playerId']
            
            if action == SectionRegistrationAction.register:
                if playerId in registeredPlayerIds:
                    raise tornado.web.HTTPError(409, 'Player already registered')

                if section['invitationOnly']:
                    raise tornado.web.HTTPError(403, 'Cannot register for an invitation-only section')
                
                registeredPlayerIds.append(playerId)
            else:
                if playerId not in registeredPlayerIds:
                    raise tornado.web.HTTPError(409, 'Player not registered')

                registeredPlayerIds.remove(playerId)

            db.sections.update(spec, section)

    @util.authenticated_async
    @gen.coroutine
    def post(self, _):
        request = json.loads(self.request.body.decode('utf-8'))

        # 1. Validate request
        validator = SectionUpdateValidator(request)
        result = validator.validate()
        if not result[0]:
            raise tornado.web.HTTPError(400, result[1])

        # 2. Massage request data
        self._format_owner_request(request)

        # 3. Retrieve parent tournament data
        db = self.settings['db']
        tournament = yield db.tournaments.find_one({ '_id': request['tournamentId'] })
        if not tournament:
            # TODO: Log error
            raise tornado.web.HTTPError(500)

        # 4. Check if user is tournament owner
        if tournament['ownerUserId'] != self.current_user:
            raise tornado.web.HTTPError(403, 'Cannot add a section to tournament {0} as you are not the owner.'
                                        .format(tournament['_id']))

        # 5. Insert section
        sectionId = yield db.sections.insert(request)
        if not sectionId:
            # TODO: Log error
            raise tornado.web.HTTPError(500)

        # 6. Write response
        request['_id'] = sectionId
        url = urlunsplit((self.request.protocol,
                          self.request.host,
                          'api/sections/{0}'.format(sectionId), '', ''))
        
        self.write(bson.json_util.dumps(request))
        self.set_header('Content-Type', 'application/json')
        self.set_header('Location', url)

    @staticmethod
    def _format_owner_request(request):
        dateFields = ('startDate', 'endDate', 'registrationStartDate', 'registrationEndDate')
        for field in dateFields:
            request[field] = dateutil.parser.parse(request[field])

        request['tournamentId'] = ObjectId(request['tournamentId'])
        request['registeredPlayerIds'] = [ObjectId(id) for id in request['registeredPlayerIds']]
