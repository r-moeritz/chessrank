import tornado.web
import pymongo
import bson.json_util
import requesthandlers.api
import util

from urllib.parse import urlunsplit
from tornado import gen
from bson.objectid import ObjectId
from util.enums import SectionRegistrationAction, SectionOwnerAction
from validation.section import (SectionRegistrationValidator, SectionUpdateValidator,
                                SectionPairingValidator, SectionCaptureValidator)
from engines.pairing import PairingEngine, PairingEngineInput

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
        def get_validator(request, section_owner_user_id):
            if section_owner_user_id == self.current_user:
                action = request.get('action', SectionOwnerAction.update_section)
                if action == SectionOwnerAction.pair_round:
                    return SectionPairingValidator(request)
                elif action == SectionOwnerAction.capture_results:
                    return SectionCaptureValidator(request)
                else:
                    return SectionUpdateValidator(request)
            
            return SectionRegistrationValidator(request)

        request = None
        db = self.settings['db']
        spec = { '_id': ObjectId(id) }

        # Deserialize request
        try:
            request = bson.json_util.loads(self.request.body.decode('utf-8'))
        except ValueError as e:
            raise tornado.web.HTTPError(400, e)
        
        # Retrieve section data
        section = yield db.sections.find_one(spec)
        if not section:
            raise tornado.web.HTTPError(404, 'Section does not exist: {0}'.format(id))

        # Validate request
        validator = get_validator(request, section['ownerUserId'])
        result = validator.validate()
        if not result[0]:
            raise tornado.web.HTTPError(400, result[1])

        # Check whether user is tournament owner
        if section['ownerUserId'] == self.current_user:
            # Tournament owner can pair rounds, capture results, and perform arbitrary updates

            # Determine type of request
            action = request.get('action', SectionOwnerAction.update_section)
            if action == SectionOwnerAction.pair_round:
                input  = PairingEngineInput(section, request['round'])
                engine = PairingEngine(self.settings)
                result = yield engine.execute(input)

                self.write(bson.json_util.dumps(result))
                self.set_header('Content-Type', 'application/json')
            elif action == SectionOwnerAction.capture_results:
                pass # TODO
            else:
                # Massage request data
                request['ownerUserId'] = self.current_user
            
                # Perform update
                db.sections.update(spec, request)
        else:
            # Non-owners can only register or unregister

            action = request['action']
            registeredPlayerIds = section['registeredPlayerIds']
            confirmedPlayerIds = section['confirmedPlayerIds']

            # Determine player id of current user
            user = yield db.users.find_one({ '_id': self.current_user })
            if not user:
                # TODO: Log error
                raise tornado.web.HTTPError(500)
            playerId = user['playerId']
            
            if action == SectionRegistrationAction.register:
                # Register player for section
                if playerId in registeredPlayerIds or playerId in confirmedPlayerIds:
                    raise tornado.web.HTTPError(409, 'Player already registered')

                if section['invitationOnly']:
                    raise tornado.web.HTTPError(403, 'Cannot register for an invitation-only section')
                
                registeredPlayerIds.append(playerId)
            else:
                # Unregister player from section
                if playerId in confirmedPlayerIds:
                    confirmedPlayerIds.remove(playerId)
                elif playerId in registeredPlayerIds:
                    registeredPlayerIds.remove(playerId)
                else:
                    raise tornado.web.HTTPError(409, 'Player not registered')

            # Perform update
            db.sections.update(spec, section)

    @util.authenticated_async
    @gen.coroutine
    def post(self, _):
        request = None

        try:
            request = bson.json_util.loads(self.request.body.decode('utf-8'))
        except ValueError as e:
            raise tornado.web.HTTPError(400, e)

        # 1. Validate request
        validator = SectionUpdateValidator(request)
        result = validator.validate()
        if not result[0]:
            raise tornado.web.HTTPError(400, result[1])

        # 2. Massage request data
        request['ownerUserId'] = self.current_user

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

    @util.authenticated_async
    @gen.coroutine
    def delete(self, id):
        spec = { '_id': ObjectId(id) }
        db = self.settings['db']

        # 1. Retrieve section data
        section = yield db.sections.find_one(spec)
        if not section:
            raise tornado.web.HTTPError(404, "Section with id '{0}' does not exist".format(id))

        # 2. Check whether user is tournament owner
        if section['ownerUserId'] != self.current_user:
            raise tornado.web.HTTPError(403, 'Only tournament owner may delete sections')
        
        db.sections.remove(spec)
