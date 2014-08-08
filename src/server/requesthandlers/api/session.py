import tornado.web
from tornado import gen
from bson.objectid import ObjectId
import json
import bcrypt
from datetime import datetime, timedelta
from requesthandlers.api import ApiHandler

class SessionHandler(ApiHandler):
    @gen.coroutine
    def post(self, _):
        request = json.loads(self.request.body.decode('utf-8'))
        db      = self.settings['db']

        # 1. Authenticate user
        try:
            user = yield db.users.find_one({ 'username': request['username'] })
        except:
            raise tornado.web.HTTPError(401)

        if not bcrypt.checkpw(request['password'], user['password_hash']):
            raise tornado.web.HTTPError(401)
        
        # 2. Check for existing session
        session = None
        try:
            session = yield db.sessions.find_one({ 'user_id': user['_id'] })
        except:
            pass # Not an error

        # 3. Delete existing session
        if session is not None:
            if session['expires'] < datetime.utcnow() or request['overwrite']:
                yield db.sessions.remove(session)
            else:
                raise tornado.web.HTTPError(403)

        # 4. Insert new session
        now = datetime.utcnow()
        oid = yield db.sessions.insert({ 'user_id': user['_id'],
                                         'created': now,
                                         'expires': now + timedelta(days=7) })

        # 5. Return session ID in cookie header
        self.set_secure_cookie('session_id', str(oid)) # TODO httponly=true, secure=true

    def delete(self, id):
        pass # TODO