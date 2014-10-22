import pymongo
import bson.json_util
import tornado.web
import requesthandlers.api
import bson.json_util
import util
import pymongo
import json
import dateutil.parser

from urllib.parse import urlunsplit
from tornado import gen
from bson.objectid import ObjectId
from validation.tournament import TournamentUpdateValidator

class TournamentHandler(requesthandlers.api.ApiHandler):
    @gen.coroutine
    def get(self, id):
        # Get optional query args
        query  = self.get_argument('query',  None)
        sort   = self.get_argument('sort',   'name')
        desc   = self.get_argument('desc',   False)
        offset = self.get_argument('offset', 0)
        limit  = self.get_argument('limit',  None)

        # Convert query args where necessary
        sortdir = pymongo.DESCENDING if desc == 'true' else pymongo.ASCENDING
        offset  = int(offset)
        limit   = int(limit) if limit else None

        # Build query spec
        spec = {}
        if id:
            spec = { '_id': { '$in': [ObjectId(id)] } }
        elif query:
            spec = {'name' : { '$regex': query, '$options': 'i' }}

        # Execute query
        db          = self.settings['db']
        tournaments = yield db.tournaments.find(spec).sort(sort, sortdir).skip(offset).to_list(limit)
        if not tournaments:
            raise tornado.web.HTTPError(404)

        # Write response
        self.write(bson.json_util.dumps(tournaments[0] if id else tournaments))
        self.set_header('Content-Type', 'application/json')

    @util.authenticated_async
    @gen.coroutine
    def put(self, id):
        request = json.loads(self.request.body.decode('utf-8'))
        db = self.settings['db']
        spec = { '_id': ObjectId(id) }
        
        # 1. Retrieve tournament data
        tournament = yield db.tournaments.find_one(spec)
        if not tournament:
            raise tornado.web.HTTPError(404, 'Tournament does not exist: {0}'.format(id))

        # 2. Check whether user is tournament owner
        if tournament['ownerUserId'] != self.current_user:
            raise tornado.web.HTTPError(403, 'Only tournament owner may update tournament data')

        # 3. Validate update request
        validator = TournamentUpdateValidator(request)
        result = validator.validate()
        if not result[0]:
            raise tornado.web.HTTPError(400, result[1])
        
        # 4. Massage request
        self._format_upsert_request(request)

        # 5. Perform update
        db.tournaments.update(spec, request)

    @util.authenticated_async
    @gen.coroutine
    def post(self, _):
        request = json.loads(self.request.body.decode('utf-8'))
        
        # 1. Validate insert request
        validator = TournamentUpdateValidator(request)
        result = validator.validate()
        if not result[0]:
            raise tornado.web.HTTPError(400, result[1])

        # 2. Massage request
        self._format_upsert_request(request)

        # 3. Perform insert
        db = self.settings['db']
        tournamentId = yield db.tournaments.insert(spec, request)
        if not tournamentId:
            raise tornado.web.HTTPError(500)

        # 4. Write response
        request['_id'] = tournamentId
        url = urlunsplit((self.request.protocol,
                          self.request.host,
                          'api/tournaments/{0}'.format(tournamentId), '', ''))
        
        self.write(bson.json_util.dumps(request))
        self.set_header('Content-Type', 'application/json')
        self.set_header('Location', url)

    def _format_upsert_request(self, request):
        request['ownerUserId'] = self.current_user
        request['startDate'] = dateutil.parser.parse(request['startDate'])
        request['endDate'] = dateutil.parser.parse(request['endDate'])