import pymongo
import bson.json_util
import tornado.web
import requesthandlers.api

from tornado import gen
from bson.objectid import ObjectId

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