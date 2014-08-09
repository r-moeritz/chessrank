import tornado.web
from tornado import gen
import json
import bcrypt
from datetime import datetime, timedelta
from requesthandlers.api import ApiHandler
import util

class SessionHandler(ApiHandler):
    @util.authenticated_async
    @gen.coroutine
    def get(self):
        """Return details of user associated with active session (logged in user)"""
        db   = self.settings['db']
        user = yield db.users.find_one({ '_id': self.current_user })
        if user is None:
            raise tornado.web.HTTPError(403)
        self.write({   'email': user['email'],
                        'name': user['name'],
                     'surname': user['surname'] })
        self.finish()     

    @gen.coroutine
    def post(self):
        """Create a new user session (login)"""
        db        = self.settings['db']
        request   = json.loads(self.request.body.decode('utf-8'))
        email     = request.get('email', None)
        password  = request.get('password', None)
        overwrite = request.get('overwrite', False)

        # 1. Verify parameters
        if not email or not password:
            raise tornado.web.HTTPError(400)

        # 2. Authenticate user
        user = yield db.users.find_one({ 'email': email })
        if user is None:
            raise tornado.web.HTTPError(401)

        if not bcrypt.checkpw(request['password'], user['passwordHash']):
            raise tornado.web.HTTPError(401)
        
        # 3. Check for existing session
        session = yield db.sessions.find_one({ 'userId': user['_id'] })

        # 4. Delete existing session
        if session is not None:
            if session['expires'] < datetime.utcnow() or overwrite:
                yield db.sessions.remove(session)
            else:
                raise tornado.web.HTTPError(403)

        # 5. Determine lifespan of new session
        settings = yield db.settings.find_one()
        lifespan = settings['sessionLifeSpanInDays']

        # 6. Insert new session
        now = datetime.utcnow()
        sessionId = yield db.sessions.insert({  'userId': user['_id'],
                                               'created': now,
                                               'expires': now + timedelta(days=lifespan) })

        # 7. Store session id in cookie
        self.set_secure_cookie('sessionId', str(sessionId), expires_days=lifespan, 
                               httponly=True) # TODO: secure=True

        # 8. Return details of logged in user
        self.write({   'email': user['email'],
                        'name': user['name'],
                     'surname': user['surname'] })

    @util.authenticated_async
    @gen.coroutine
    def delete(self):
        """Destroy active user session (logout)"""
        db = self.settings['db']
        yield db.sessions.remove({ 'userId': self.current_user })
        self.clear_cookie('sessionId') # TODO: Check if remove succeeded?
        self.finish()