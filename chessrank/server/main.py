#! python

import pymongo
import motor

from os import path
from tornado.ioloop import IOLoop
from tornado.options import options
from requesthandlers import IndexHandler
from requesthandlers.api import ApiHandler
from requesthandlers.api.player import PlayerHandler
from requesthandlers.api.user import UserHandler
from requesthandlers.api.tournament import TournamentHandler
from requesthandlers.api.session import SessionHandler
from requesthandlers.api.lookups import LookupsHandler
from requesthandlers.api.verify import VerifyHandler
from app import CustomApp

options.define('port', default=8888, help='run on the given port', type=int)

def load_app_settings():
    db = pymongo.MongoClient().chessrank
    return db.settings.find_one()

def main():
    server_path   = path.dirname(__file__)
    template_path = path.join(server_path, 'templates')
    static_path   = path.normpath(path.join(server_path, '..', 'client'))
    
    settings = {
                  'static_path': static_path,
                'template_path': template_path,
                 'xsrf_cookies': False, # TODO: Enable
                    'login_url': '/',
                           'db': motor.MotorClient().chessrank,
                }

    app_settings = load_app_settings()
    settings.update(app_settings)

    handlers = [
                (r'/api/tournaments(?:/([0-9a-fA-F]{24}))?.*', TournamentHandler),
                (r'/api/players(?:/([0-9a-fA-F]{24}))?.*', PlayerHandler),
                (r'/api/users(?:/([0-9a-fA-F]{24}))?.*', UserHandler),
                (r'/api/verify/(.+)', VerifyHandler),
                (r'/api/session', SessionHandler),
                (r'/api/lookups', LookupsHandler),
                (r'/api.*', ApiHandler),
                (r'/', IndexHandler)
                ]

    options.parse_command_line()
    app = CustomApp(handlers, 'localhost', **settings)
    app.listen(options.port)
    IOLoop.instance().start()

# Start the app
main()
