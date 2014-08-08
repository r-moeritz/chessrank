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
        user = yield db.users.find_one({ 'username': request['username'] })
        if user is None:
            raise tornado.web.HTTPError(401)

        if not bcrypt.checkpw(request['password'], user['passwordHash']):
            raise tornado.web.HTTPError(401)
        
        # 2. Check for existing session
        session = yield db.sessions.find_one({ 'userId': user['_id'] })

        # 3. Delete existing session
        if session is not None:
            if session['expires'] < datetime.utcnow() or request['overwrite']:
                yield db.sessions.remove(session)
            else:
                raise tornado.web.HTTPError(403)

        # 4. Determine lifespan for new sessions
        settings = yield db.settings.find_one()
        lifespan = settings['sessionLifeSpanInDays']

        # 5. Insert new session
        now = datetime.utcnow()
        oid = yield db.sessions.insert({ 'userId': ObjectId(user['_id']),
                                         'created': now,
                                         'expires': now + timedelta(days=lifespan) })

        # 6. Return session ID in cookie header
        self.set_secure_cookie('sessionId', str(oid), expires_days=lifespan, 
                               max_age_days=lifespan) # TODO httponly=true, secure=true

    def delete(self, id):
        pass # TODO