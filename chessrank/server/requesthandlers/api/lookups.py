import bson.json_util
import requesthandlers.api
from tornado import gen

class LookupsHandler(requesthandlers.api.ApiHandler):
    @gen.coroutine
    def get(self):
        db = self.settings['db']
        lookups = yield db.lookups.find_one({}, { '_id': False })
        self.write(bson.json_util.dumps(lookups))
        self.set_header('Content-Type', 'application/json')