import tornado.web

from tornado import gen
from engines.verify import EmailVerificationEngine

class IndexPageHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('index.html')

class VerifyPageHandler(tornado.web.RequestHandler):
    @gen.coroutine
    def get(self, payload):
        # 1. Activate user account and create new session (login)
        engine = EmailVerificationEngine(self.settings)
        result = yield engine.verify(payload)

        # 2. Store session details in cookie
        self.set_secure_cookie('sessionId', str(result.sessionId), 
                               expires_days = result.lifespan,
                               httponly     = True) # TODO: secure=True

        self.redirect('/')