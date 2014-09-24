import tornado.web
from tornado import gen
from tornado_smtp.client import TornadoSMTP

class CustomApp(tornado.web.Application):
    @gen.coroutine
    def get_smtp_client(self):
        config = self.settings['smtp_config']
        smtp = TornadoSMTP(config['host'])
        yield smtp.starttls()
        yield smtp.login(config['user'], config['password'])
        return smtp
