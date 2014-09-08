import json
import re
from tornado import gen
import tornado.web
import pymongo
import bson.json_util
from bson.objectid import ObjectId
from requesthandlers.api import ApiHandler
from util.enums import FideTitle

class UserHandler(ApiHandler):
    @gen.coroutine
    def get(self, uid):
        # Get optional query args
        id     = self.get_argument('id',     uid)
        q      = self.get_argument('q',      None)
        sort   = self.get_argument('sort',   'priority')
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
        elif q:
            spec = { 'email': { '$regex': q, '$options': 'i' } }

        db    = self.settings['db']
        if spec:
            users = yield db.users.find(spec).sort(sort, sortdir).to_list(None)

        # Query players by user id
        if users:
            extra_players = yield (db.players.find({ '_id': { '$in': [u['playerId'] for u in users] } })
                                   .sort(sort, sortdir).to_list(None))

        if not uid:
            # Query players by name and surname
            spec = {}
            if q:
                spec = { '$or': [{ 'name': { '$regex': q, '$options': 'i' } },
                                 { 'surname': { '$regex': q, '$options': 'i' } }] }

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
            if any(r['_id'] == u['_id'] for r in results):
                continue
            p = next((p for p in players if p['_id'] == u['playerId']), {})
            results.append({ '_id': u['_id'],
                          'gender': u['gender'],
                            'name': p['name'],
                         'surname': p['surname'] })

        # Write response
        if uid and results:
            self.write(bson.json_util.dumps(results[0]))
        else:
            # TODO: Restrict results by offset and limit
            self.write(bson.json_util.dumps(results))

        self.set_header('Content-Type', 'application/json')

    @gen.coroutine
    def post(self, _):
        request = json.loads(self.request.body.decode('utf-8'))
        
        # 1. Verify signup details
        result = self._verify_signup_details(request)
        if not result[0]:
            raise tornado.web.HTTPError(400, result[1])

        # TODO
        # 2. Generate email link
        # 3. Store signup details (async)
        # 4. Send confirmation email (async)
        # 5. Write response
        pass

    def _verify_signup_details(self, details):
        result = self._verify_required_fields(details)
        if not result[0]:
            return result

        result = self._verify_optional_fields(details)
        return result

    def _verify_required_fields(self, details):
        required = { 'name': self._verify_name, 
                  'surname': self._verify_name, 
                   'gender': self._verify_gender, 
                    'email': self._verify_email }
        missing  = set(required.keys()) - set(details.keys())
        if missing:
            return (False, "Required field '{0}' missing"
                    .format(next(iter(missing))))

        for field in required:
            validate = required[field]
            result = validate(field, details[field])
            if not result[0]:
                return result

        return (True, None)

    def _verify_optional_fields(self, details):
        optional = { 'dateOfBirth': self._verify_date_of_birth, 
                   'contactNumber': self._verify_telno, 
                      'fideRating': self._verify_rating, 
                       'fedRating': self._verify_rating,
                       'fideTitle': self._verify_fide_title }
        for field in optional:
            if field in details:
                validate = optional[field]
                result = validate(field, details[field])
                if not result[0]:
                    return result

        return (True, None)

    @staticmethod
    def _verify_name(field, value):
        return ((True, None) if type(value) == str
                and len(value) > 1 and len(value) < 51
                else (False, "Field '{0}' must be between 2 and 50 characters long".format(field)))

    @staticmethod
    def _verify_email(field, value):
        return ((True, None) if type(value) == str 
                and re.fullmatch(r'^[\w\.\+]+@\w+\.\w+$', value)
                else (False, "Field '{0}' must be a valid email address".format(field)))

    @staticmethod
    def _verify_gender(field, value):
        return ((True, None) if value in (0, 1)
                else (False, "Field '{0}' must be either 0 or 1".format(field)))

    @staticmethod
    def _verify_telno(field, value):
        return ((True, None) if type(value) == str
                and re.fullmatch(r'^\+\d{11}$', value)
                else (False, "Field '{0}' must be a valid telephone number".format(field)))

    @staticmethod
    def _verify_date_of_birth(field, value):
        return (True, None) # TODO: DOB validation

    @staticmethod
    def _verify_rating(field, value):
        return ((True, None) if type(value) == int and value > 0
                else (False, "Field '{0}' must be a positive integer".format(field)))

    @staticmethod
    def _verify_fide_title(field, value):
        return ((True, None) if value in list(FideTitle)
                else (False, "Field '{0}' must be an integer between 0 and 7".format(field)))