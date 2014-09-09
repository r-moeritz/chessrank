#! python

import tornado.ioloop
import tornado.web
import motor
from os import path
from requesthandlers import IndexHandler
from requesthandlers.api import ApiHandler
from requesthandlers.api.player import PlayerHandler
from requesthandlers.api.user import UserHandler
from requesthandlers.api.tournament import TournamentHandler
from requesthandlers.api.session import SessionHandler
from requesthandlers.api.lookups import LookupsHandler

def main():
    serverPath   = path.dirname(__file__)
    templatePath = path.join(serverPath, 'templates')
    staticPath   = path.normpath(path.join(serverPath, '..', 'client'))
    db           = motor.MotorClient().chessrank

    settings = {
                           'db': db,
                  'static_path': staticPath,
                'template_path': templatePath,
                'cookie_secret': '2Sht+AfTRESND20cSXB4XxXdBsYkOkxUoWCWnoXzVok=',
                 'xsrf_cookies': False, # TODO: Enable
                    'login_url': '/'
                }

    handlers = [
                (r'/api/tournaments(?:/([0-9a-fA-F]{24}))?.*', TournamentHandler),
                (r'/api/players(?:/([0-9a-fA-F]{24}))?.*', PlayerHandler),
                (r'/api/users(?:/([0-9a-fA-F]{24}))?.*', UserHandler),
                (r'/api/session', SessionHandler),
                (r'/api/lookups', LookupsHandler),
                (r'/api.*', ApiHandler),
                (r'/', IndexHandler)
                ]

    app = tornado.web.Application(handlers, **settings)
    app.listen(8888)
    tornado.ioloop.IOLoop.instance().start()

# Start the app
main()
