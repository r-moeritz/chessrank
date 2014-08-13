from tornado import gen
import bson.json_util
from requesthandlers.api import ApiHandler

class LookupsHandler(ApiHandler):
    @gen.coroutine
    def get(self):
        db = self.settings['db']
        lookups = yield db.lookups.find_one({}, { '_id': False })
        self.write(bson.json_util.dumps(lookups))
        self.set_header('Content-Type', 'application/json')