import json
import tornado.web
import tornado.template
import pymongo
import bson.json_util
import itsdangerous
import bcrypt
import requesthandlers.api

from tornado import gen
from email.message import EmailMessage
from bson.objectid import ObjectId
from urllib.parse import urlunsplit
from validation.signup import SignupValidator
from util.enums import UserStatus

class UserHandler(requesthandlers.api.ApiHandler):
    @gen.coroutine
    def get(self, id):
        # Get optional query args
        query  = self.get_argument('query',  None)
        sort   = self.get_argument('sort',   'email')
        desc   = self.get_argument('desc',   False)
        offset = self.get_argument('offset', 0)
        limit  = self.get_argument('limit',  None)

        # Convert query args where necessary
        sortdir = pymongo.DESCENDING if desc == 'true' else pymongo.ASCENDING
        offset  = int(offset)
        limit   = int(limit) if limit else None

        users = []
        players = []
        extra_users = []
        extra_players = []

        # Query users by object id or email
        spec = {}
        if id:
            spec = { '_id': { '$in': [ObjectId(id)] } }
        elif query:
            spec = { 'email': { '$regex': query, '$options': 'i' } }

        db = self.settings['db']
        users = yield db.users.find(spec).sort(sort, sortdir).to_list(None)

        # Query players by user id
        if users:
            extra_players = yield (db.players.find({ '_id': { '$in': [u['playerId'] for u in users] } })
                                   .sort(sort, sortdir).to_list(None))

        if not id:
            # Query players by name and surname
            spec = {}
            if query:
                spec = { '$or': [{ 'name': { '$regex': query, '$options': 'i' } },
                                 { 'surname': { '$regex': query, '$options': 'i' } }] }

            if spec:
                players = yield db.players.find(spec).sort(sort, sortdir).to_list(None)
        
            # Query users by player id
            if players:
                extra_users = yield (db.users.find({ 'playerId': { '$in': [p['_id'] for p in players] } })
                                     .sort(sort, sortdir).to_list(None))

        # Consolidate results
        users   += extra_users
        players += extra_players

        # Join players and users, taking care to avoid duplicates
        results = []
        for u in users:
            if any(r['userId'] == u['_id'] for r in results):
                continue
            p = next((p for p in players if p['_id'] == u['playerId']), {})
            results.append({ 'userId':   u['_id'],
                             'playerId': u['playerId'],
                             'gender':   p['gender'],
                             'name':     p['name'],
                             'surname':  p['surname'] })

        # Write response
        if id and results:
            self.write(bson.json_util.dumps(results[0]))
        else:
            # TODO: Restrict results by offset and limit
            self.write(bson.json_util.dumps(results))

        self.set_header('Content-Type', 'application/json')

    @gen.coroutine
    def post(self, _):
        details = json.loads(self.request.body.decode('utf-8'))
        
        # 1. Validate signup details
        validator = SignupValidator(details)
        result    = validator.validate()
        if not result[0]:
            raise tornado.web.HTTPError(400, result[1])

        # 2. Ensure user with same email does not already exist
        db = self.settings['db']
        exists = yield db.users.find({ 'email': details.get('email') }).count()
        if exists:
            raise tornado.web.HTTPError(409, "A user with email address '{0}' already exists"
                                        .format(details.get('email')))

        # 3. Create user account
        uid = yield self._create_user(details)

        # 4. Generate verification URL
        payload = self._serialize_for_url(str(uid))
        url     = urlunsplit((self.request.protocol,
                             self.request.host,
                             'verify/{0}'.format(payload), '', ''))

        # 5. Send confirmation email
        smtp = yield self.application.get_smtp_client()
        msg  = self._create_confirmation_message(details, url)
        smtp.send_message(msg)

    @gen.coroutine
    def _create_user(self, details):
        db  = self.settings['db']
        
        # Insert player
        player = {
            # Mandatory details
            'name': details['name'],
            'surname': details['surname'],
            'gender': details['gender'],
            'emailAddress': ['email'],

            # Optional details
            'fideRating': details.get('fideRating'),
            'fideTitle': details.get('fideTitle'),
            'federationRating': details.get('fedRating'),
            'federationTitle': details.get('fedTitle'),
            'dateOfBirth': details.get('dateOfBirth'),
            'federation': details.get('federation'),
            'union': details.get('union'),
            'contactNumber': details.get('contactNumber')
        }

        pid          = yield db.players.insert(player)
        password     = details['password']
        passwordHash = bcrypt.hashpw(password, bcrypt.gensalt())

        user = {
            'email': details['email'],
            'playerId': pid,
            'passwordHash': passwordHash,
            'status': UserStatus.unconfirmed
        }

        uid = yield db.users.insert(user)
        return uid

    def _serialize_for_url(self, value):
        key = self.settings['cookie_secret']
        s = itsdangerous.URLSafeSerializer(key)
        return s.dumps(value)

    def _create_confirmation_message(self, details, url):
        config = self.settings['smtp_config']
        
        msg            = EmailMessage()
        msg['Subject'] = 'ChessRank: Please confirm your email address'
        msg['To']      = details['email']
        msg['From']    = config['from']

        loader = tornado.template.Loader(self.settings['template_path'])
        body   = loader.load('verify.html').generate(name=details['name'], url=url).decode('utf-8')
        msg.set_content(body, subtype='html')

        return msg