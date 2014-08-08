from tornado import gen
import pymongo
import bson.json_util
from bson.objectid import ObjectId
from requesthandlers.api import ApiHandler

class TournamentHandler(ApiHandler):
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

        # Build query spec
        spec = {}
        if id:
            spec = {'_id': ObjectId(id)}
        elif q:
            spec = {'name' : { '$regex': q, '$options': 'i' }}

        # Execute query
        db    = self.settings['db']
        todos = yield (db.tournaments.find_one(spec) 
                       if uid 
                       else db.tournaments.find(spec).sort(sort, sortdir).skip(offset).to_list(limit))
        
        # Write response
        self.write(bson.json_util.dumps(todos))
        self.set_header('Content-Type', 'application/json')