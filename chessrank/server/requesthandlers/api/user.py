import json
from tornado import gen
import tornado.web
import pymongo
import bson.json_util
from bson.objectid import ObjectId
from requesthandlers.api import ApiHandler
from validation.signup import SignupValidator

class UserHandler(ApiHandler):
    @gen.coroutine
    def get(self, uid):
        # Get optional query args
        id     = self.get_argument('id',     uid)
        q      = self.get_argument('q',      None)
        sort   = self.get_argument('sort',   'priority')
        desc   = self.get_argument('desc',   False)
        offset = self.get_argument('offset', 0)
        limit  = self.get_argument('limit',  None)

        # Convert query args where necessary
        sortdir = pymongo.DESCENDING if desc == 'true' else pymongo.ASCENDING
        offset  = int(offset)
        limit   = int(limit) if limit else None

        users = []
        players = []
        extra_users = []
        extra_players = []

        # Query users by object id or email
        spec = {}
        if id:
            spec = { '_id': { '$in': [ObjectId(id)] } }
        elif q:
            spec = { 'email': { '$regex': q, '$options': 'i' } }

        db    = self.settings['db']
        if spec:
            users = yield db.users.find(spec).sort(sort, sortdir).to_list(None)

        # Query players by user id
        if users:
            extra_players = yield (db.players.find({ '_id': { '$in': [u['playerId'] for u in users] } })
                                   .sort(sort, sortdir).to_list(None))

        if not uid:
            # Query players by name and surname
            spec = {}
            if q:
                spec = { '$or': [{ 'name': { '$regex': q, '$options': 'i' } },
                                 { 'surname': { '$regex': q, '$options': 'i' } }] }

            if spec:
                players = yield db.players.find(spec).sort(sort, sortdir).to_list(None)
        
            # Query users by player id
            if players:
                extra_users = yield (db.users.find({ 'playerId': { '$in': [p['_id'] for p in players] } })
                                     .sort(sort, sortdir).to_list(None))

        # Consolidate results
        users   += extra_users
        players += extra_players

        # Join players and users, taking care to avoid duplicates
        results = []
        for u in users:
            if any(r['_id'] == u['_id'] for r in results):
                continue
            p = next((p for p in players if p['_id'] == u['playerId']), {})
            results.append({ '_id': u['_id'],
                          'gender': u['gender'],
                            'name': p['name'],
                         'surname': p['surname'] })

        # Write response
        if uid and results:
            self.write(bson.json_util.dumps(results[0]))
        else:
            # TODO: Restrict results by offset and limit
            self.write(bson.json_util.dumps(results))

        self.set_header('Content-Type', 'application/json')

    @gen.coroutine
    def post(self, _):
        request = json.loads(self.request.body.decode('utf-8'))
        
        # 1. Verify signup details
        validator = SignupValidator(request)
        result    = validator.validate()
        if not result[0]:
            raise tornado.web.HTTPError(400, result[1])

        # TODO
        # 2. Generate email link
        # 3. Store signup details (async)
        # 4. Send confirmation email (async)
        # 5. Write response
        pass
