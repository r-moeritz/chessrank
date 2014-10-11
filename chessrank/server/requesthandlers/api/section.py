import json
import tornado.web
import pymongo
import bson.json_util
import requesthandlers.api
import util

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
        
        section = yield db.sections.find_one(spec)
        if not section:
            raise tornado.web.HTTPError(404, 'Section does not exist: {0}'.format(id))

        tournament = yield db.tournaments.find_one({ '_id': section['tournamentId'] })
        if not tournament:
            # TODO: Log error
            raise tornado.web.HTTPError(500)

        if tournament['ownerUserId'] == self.current_user:
            # Update requested by tournament owner
            validator = SectionUpdateValidator(request)
            result = validator.validate()
            if not result[0]:
                raise tornado.web.HTTPError(400, result[1])
        else:
            # Update requested by other user: only allow registration
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
