#! python

import tornado.ioloop
import tornado.web
import motor
from os import path
from requesthandlers import *

def main():
    serverPath   = path.dirname(__file__)
    templatePath = path.join(serverPath, 'templates')
    staticPath   = path.normpath(path.join(serverPath, '..', 'client'))
    db           = motor.MotorClient().chessrank

    settings = {
                           'db': db,
                  'static_path': staticPath,
                'template_path': templatePath
                }

    handlers = [
                (r'/api/tournaments(?:/([0-9a-fA-F]{24}))?.*', TournamentsHandler),
                (r'/api/players(?:/([0-9a-fA-F]{24}))?.*', PlayersHandler),
                (r'/api.*', ApiHandler),
                (r'/', RootHandler)
                ]

    app = tornado.web.Application(handlers, **settings)
    app.listen(8888)
    tornado.ioloop.IOLoop.instance().start()

# Start the app
main()
