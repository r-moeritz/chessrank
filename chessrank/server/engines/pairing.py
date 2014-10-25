import engines
import tornado.web
import util.enums

from bson.objectid import ObjectId
from tornado import gen
from swissdutch.dutch import DutchPairingEngine
from swissdutch.player import Player
from util.enums import RatingType

class PairingEngineInput:
    def __init__(self, section, round):
        self._section = section
        self._round = round

    @property
    def section(self):
        return self._section

    @property
    def round(self):
        return self._round

class PairingEngine(engines.Engine):
    def __init__(self, settings):
        super().__init__(settings)

    @gen.coroutine
    def execute(self, data):
        db = self._settings['db']
        dutch = DutchPairingEngine()

        if data.round == 1:
            # Fetch tournament
            tournament = yield db.tournaments.find_one({ '_id': data.section['tournamentId'] })
            if not tournament:
                # TODO: Log error
                raise tornado.web.HTTPError(500)

            # Fetch players confirmed registered for section
            playerIds = data.section['confirmedPlayerIds']
            players = yield db.players.find({ '_id': { '$in': playerIds } }).to_list(None)
            if not players:
                # TODO: Log error
                raise tornado.web.HTTPError(500)

            # Extract data and create swissdutch player objects
            ratingType = tournament['ratingType']
            provisionalRating = data.section['provisionalRating']
            dutchInput = [self._extract_player_data(p, ratingType, provisionalRating) for p in players]

            # Pair round
            dutchResults = dutch.pair_round(1, dutchInput)

            # Convert results for storage
            bsonResults = [self._extract_pairing_result(r) for r in dutchResults]

            # Update section.roundData and write to db
            roundData = data.section['roundData']
            round = roundData[data.round-1]
            round['results'] = bsonResults

            yield db.sections.update({ '_id': data.section['_id'] },
                                     { '$set': { 'roundData': roundData } })

            # Return updated round
            return round
        else:
            pass # TODO

    def _extract_pairing_result(self, result):
        return { 'playerId': ObjectId(result.name),
                 'rating': result.rating,
                 'title': int(result.title),
                 'pairing_no': result.pairing_no,
                 'score': None,
                 'float_status': int(result.float_status),
                 'opponents': result.opponents,
                 'colour_hist': [int(c) for c in result.colour_hist] }
    
    def _extract_player_data(self, player, ratingType, provisionalRating):
        return (Player(name=str(player['_id']), 
                       rating=player['fideRating'] or provisionalRating, 
                       title=player['fideTitle'] or 0)
                if ratingType == RatingType.fide
                else Player(name=str(player['_id']), 
                            rating=player['federationRating'] or provisionalRating, 
                            title=0))
