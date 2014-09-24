import tornado.web
import requesthandlers.api

from tornado import gen
from itsdangerous import URLSafeSerializer, BadSignature
from bson.objectid import ObjectId
from util.enums import UserStatus

class VerifyHandler(requesthandlers.api.ApiHandler):
    @gen.coroutine
    def get(self, payload):
        key = self.settings['cookie_secret']
        s   = URLSafeSerializer(key)
        uid = None

        try:
            uid = ObjectId(s.loads(payload))
        except BadSignature:
            raise tornado.web.HTTPError(400)

        db = self.settings['db']

        # 1. Determine if user exists and is in unconfirmed state
        user = yield db.users.find_one({ '_id': uid, 'status': UserStatus.unconfirmed })
        if not user:
            raise tornado.web.HTTPError(410)

        # 2. Set user status to active
        yield db.users.update({ '_id': uid}, { '$set': { 'status': UserStatus.active } })

        # 3. TODO: Write response