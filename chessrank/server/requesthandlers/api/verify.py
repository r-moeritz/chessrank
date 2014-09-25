import requesthandlers.api

from tornado import gen
from engines.verify import EmailVerificationEngine

class VerifyHandler(requesthandlers.api.ApiHandler):
    @gen.coroutine
    def get(self, payload):
        # 1. Activate user account and create new session (login)
        engine = EmailVerificationEngine(self.settings)
        result = yield engine.verify(payload)

        # 2. Store session details in cookie
        self.set_secure_cookie('sessionId', str(result.sessionId), 
                               expires_days = result.lifespan,
                               httponly     = True) # TODO: secure=True

        # 2. Return details of logged in user
        db     = self.settings['db']
        player = yield db.players.find_one({ '_id': result.user['playerId'] })

        self.write({ 'email': result.user['email'],
                      'name': player['name'],
                   'surname': player['surname'] })