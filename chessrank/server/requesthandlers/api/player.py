import pymongo
import bson.json_util
import requesthandlers.api
import tornado.web

from bson.objectid import ObjectId
from tornado import gen

class PlayerHandler(requesthandlers.api.ApiHandler):
    @gen.coroutine
    def get(self, id):
        # Get optional query args
        query  = self.get_argument('query',  None)
        sort   = self.get_argument('sort',   'surname')
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
        db      = self.settings['db']
        players = yield db.players.find(spec).sort(sort, sortdir).skip(offset).to_list(limit)
        if not players:
            raise  tornado.web.HTTPError(404)
        
        # Write response
        self.write(bson.json_util.dumps(players[0] if id else players))
        self.set_header('Content-Type', 'application/json')
