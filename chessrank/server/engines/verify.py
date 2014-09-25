import tornado.web

from datetime import datetime, timedelta
from itsdangerous import URLSafeSerializer, BadSignature
from bson.objectid import ObjectId
from tornado import gen
from util.enums import UserStatus

class EmailVerificationResult:
    def __init__(self, user, sessionId, lifespan):
        self._user      = user
        self._sessionId = sessionId
        self._lifespan  = lifespan

    @property
    def user(self):
        return self._user

    @property
    def sessionId(self):
        return self._sessionId

    @property
    def lifespan(self):
        return self._lifespan

class EmailVerificationEngine:
    def __init__(self, settings):
        self._settings = settings

    @gen.coroutine
    def verify(self, payload):
        # 1. Extract user id from payload
        key = self._settings['cookie_secret']
        s   = URLSafeSerializer(key)
        uid = None

        try:
            uid = ObjectId(s.loads(payload))
        except BadSignature:
            raise tornado.web.HTTPError(400)

        db = self._settings['db']

        # 2. Determine if user exists and is in unconfirmed state
        user = yield db.users.find_one({ '_id': uid, 'status': UserStatus.unconfirmed })
        if not user:
            raise tornado.web.HTTPError(410)

        # 3. Set user status to active
        yield db.users.update({ '_id': uid}, { '$set': { 'status': UserStatus.active } })

        # 4. Determine lifespan of new session
        lifespan = self._settings['session_lifespan']

        # 5. Insert new session
        now = datetime.utcnow()
        sessionId = yield db.sessions.insert({ 'userId': uid,
                                              'created': now,
                                              'persistentCookie': True,
                                              'expires': now + timedelta(days=lifespan) })

        return EmailVerificationResult(user, sessionId, lifespan)
