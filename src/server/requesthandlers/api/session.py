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
        db        = self.settings['db']
        request   = json.loads(self.request.body.decode('utf-8'))
        email     = request.get('email', None)
        password  = request.get('password', None)
        overwrite = request.get('overwrite', False)

        if not email or not password:
            raise tornado.web.HTTPError(400)

        # 1. Authenticate user
        user = yield db.users.find_one({ 'email': email })
        if user is None:
            raise tornado.web.HTTPError(401)

        if not bcrypt.checkpw(request['password'], user['passwordHash']):
            raise tornado.web.HTTPError(401)
        
        # 2. Check for existing session
        session = yield db.sessions.find_one({ 'userId': ObjectId(user['_id']) })

        # 3. Delete existing session
        if session is not None:
            if session['expires'] < datetime.utcnow() or overwrite:
                yield db.sessions.remove(session)
            else:
                raise tornado.web.HTTPError(403)

        # 4. Determine lifespan for new session
        settings = yield db.settings.find_one()
        lifespan = settings['sessionLifeSpanInDays']

        # 5. Insert new session
        now = datetime.utcnow()
        sessionId = yield db.sessions.insert({  'userId': user['_id'],
                                               'created': now,
                                               'expires': now + timedelta(days=lifespan) })

        # 6. Store sessionId in cookie
        self.set_secure_cookie('sessionId', str(sessionId), expires_days=lifespan, 
                               httponly=True) # TODO: secure=True

    def delete(self, id):
        pass # TODO