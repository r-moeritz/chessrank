import http.client
from datetime import datetime
import tornado.web
from tornado import gen
from bson.objectid import ObjectId

class ApiHandler(tornado.web.RequestHandler):
    current_user = None

    def get(self):
        raise tornado.web.HTTPError(404)

    def write_error(self, status_code, **kwargs):
        self.clear()
        self.set_status(status_code)
        self.finish({ 'status_code': status_code, 
                      'message':     http.client.responses[status_code] })

    @gen.coroutine
    def get_current_user_async(self):
        sessionId = self.get_secure_cookie('sessionId')
        if not sessionId:
            return None

        db = self.settings['db']
        session = yield db.sessions.count({     '_id': ObjectId(sessionId),
                                            'expires': { '$gt': datetime.utcnow() } })

        return session['userId'] if session else None