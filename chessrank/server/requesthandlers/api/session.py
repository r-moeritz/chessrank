import tornado.web
import json
import bcrypt
import bson.json_util
import requesthandlers.api
import util

from tornado import gen
from datetime import datetime, timedelta
from util.enums import UserStatus

class SessionHandler(requesthandlers.api.ApiHandler):
    @util.authenticated_async
    @gen.coroutine
    def get(self):
        """Return details of user associated with active session (logged in user)"""
        db   = self.settings['db']
        user = yield db.users.find_one({ '_id': self.current_user })
        if not user:
            # TODO: Log error
            raise tornado.web.HTTPError(500)

        player = yield db.players.find_one({ '_id': user['playerId'] })
        if not player:
            # TODO: Log error
            raise tornado.web.HTTPError(500)

        result = { 'userId':   user['_id'],
                   'email':    user['email'],
                   'playerId': user['playerId'],
                   'name':     player['name'],
                   'surname':  player['surname'] }
        self.write(bson.json_util.dumps(result))
        self.set_header('Content-Type', 'application/json')

    @gen.coroutine
    def post(self):
        """Create a new user session (login)"""
        db                = self.settings['db']
        request           = json.loads(self.request.body.decode('utf-8'))
        email             = request.get('email', None)
        password          = request.get('password', None)
        overwriteExisting = request.get('overwriteExisting', None)
        persistentCookie  = request.get('persistentCookie', False)

        # 1. Verify parameters
        if not email or not password:
            raise tornado.web.HTTPError(400, "Fields 'email' and 'password' are required")

        # 2. Authenticate user
        user = yield db.users.find_one({ 'email': email, 'status': UserStatus.active })
        if not user:
            raise tornado.web.HTTPError(401)

        if not bcrypt.checkpw(request['password'], user['passwordHash']):
            raise tornado.web.HTTPError(401)
        
        # 3. Check for existing session
        session = yield db.sessions.find_one({ 'userId': user['_id'] })

        # 4. Delete existing session
        if session:
            if overwriteExisting or session['expires'] < datetime.utcnow() or not session['persistentCookie']:
                db.sessions.remove(session)
            elif overwriteExisting is None:
                # Let the user decide whether to overwrite the existing session
                raise tornado.web.HTTPError(300)
            else:
                raise tornado.web.HTTPError(403, 'Existing session')

        # 5. Determine lifespan of new session
        lifespan = self.settings['session_lifespan']

        # 6. Insert new session
        now = datetime.utcnow()
        sessionId = yield db.sessions.insert({ 'userId': user['_id'],
                                              'created': now,
                                     'persistentCookie': persistentCookie,
                                              'expires': now + timedelta(days=lifespan) })
        if not sessionId:
            # TODO: Log error
            raise tornado.web.HTTPError(500)

        # 7. Store session id in cookie
        self.set_secure_cookie('sessionId', str(sessionId), 
                               expires_days = lifespan if persistentCookie else None, 
                               httponly     = True) # TODO: secure=True

        # 8. Return details of logged in user
        player = yield db.players.find_one({ '_id': user['playerId'] })
        if not player:
            # TODO: Log error
            raise tornado.web.HTTPError(500)

        result = { 'userId':   user['_id'],
                   'email':    user['email'],
                   'playerId': user['playerId'],
                   'name':     player['name'],
                   'surname':  player['surname'] }
        self.write(bson.json_util.dumps(result))
        self.set_header('Content-Type', 'application/json')

    @util.authenticated_async
    @gen.coroutine
    def delete(self):
        """Destroy active user session (logout)"""
        db = self.settings['db']
        db.sessions.remove({ 'userId': self.current_user })
        self.clear_cookie('sessionId')
        self.finish()