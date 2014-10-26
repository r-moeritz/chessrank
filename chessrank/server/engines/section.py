import engines
import tornado.web
import util.enums

from bson.objectid import ObjectId
from tornado import gen
from swissdutch.dutch import DutchPairingEngine
from swissdutch.player import Player
from util.enums import RatingType, RoundStatus, GameResult

class ResultsCaptureEngineInput:
    def __init__(self, section, round, results, finalize):
        self._section = section
        self._round = round
        self._results = results
        self._finalize = finalize

    @property
    def section(self):
        return self._section

    @property
    def round(self):
        return self._round

    @property
    def results(self):
        return self._results

    @property
    def finalize(self):
        return self._finalize

class ResultsCaptureEngine(engines.Engine):
    def __init__(self, settings):
        super().__init__(settings)

    @gen.coroutine
    def execute(self, data):
        db = self._settings['db']

        roundData = data.section['roundData']
        thisRound = roundData[data.round-1]

        if thisRound['status'] == RoundStatus.unpaired:
            raise tornado.web.HTTPError(403, 'Round {0} has not yet been paired and cannot be updated'.format(data.round))

        if thisRound['status'] == RoundStatus.completed:
            raise tornado.web.HTTPError(403, 'Round {0} has been completed and cannot be updated again'.format(data.round))

        data.section['playerData'] = data.results
        fields = {}
        if data.finalize:
            thisRound['status'] = RoundStatus.completed
            fields = { 'roundData': roundData }
        else:
            fields = { 'playerData': data.results }

        yield db.sections.update({ '_id': data.section['_id'] },
                                 { '$set': fields })

        return data.section

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
        roundData = data.section['roundData']
        thisRound = roundData[data.round-1]

        if thisRound['status'] == RoundStatus.completed:
            raise tornado.web.HTTPError(403, 'Round {0} has been completed and cannot be paired again'.format(data.round))

        if any(rd['status'] == RoundStatus.paired for rd in roundData):
            raise tornado.web.HTTPError(403, 'Cannot pair another round until current round is completed')
        
        db = self._settings['db']
        dutch = DutchPairingEngine()
        bsonResults = None

        if data.round == 1:
            # First round: extract and prepare player data

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

            # Create swissdutch players
            ratingType = tournament['ratingType']
            provisionalRating = data.section['provisionalRating']
            dutchPlayers = [self._create_basic_dutch_player(p, ratingType, provisionalRating) for p in players]

            # Pair round
            dutchResults = dutch.pair_round(data.round, dutchPlayers)

            # Convert results for storage
            bsonResults = [self._extract_dutch_result(r) for r in dutchResults]
        else:
            # Subsequent round: load player data
            playerData = data.section['playerData']
            dutchPlayers = [self._create_detailed_dutch_player(pd) for pd in playerData]
        
            # Pair round
            dutchResults = dutch.pair_round(data.round, dutchPlayers)

            # Convert results for storage
            bsonResults = [self._extract_dutch_result(r, self._find_previous_results(r, playerData)) for r in dutchResults]

        # Update section and save to DB
        data.section['playerData'] = bsonResults
        thisRound['status'] = RoundStatus.paired

        yield db.sections.update({ '_id': data.section['_id'] },
                                    { '$set': { 'roundData': roundData,
                                                'playerData': bsonResults } })

        # Return updated section
        return data.section

    def _find_previous_results(self, dutchPlayer, playerData):
        playerId = ObjectId(dutchPlayer.name)
        return next(pd['results'] for pd in playerData if pd['playerId'] == playerId)

    def _extract_dutch_result(self, dutch_result, prevResults=None):
        prevResults = (prevResults or [])
        if dutch_result.opponents[-1] == 0:
            prevResults.append(GameResult.bye)

        return { 'playerId': ObjectId(dutch_result.name),
                 'rating': dutch_result.rating,
                 'title': dutch_result.title,
                 'pairing_no': dutch_result.pairing_no,
                 'score': dutch_result.score,
                 'float_status': dutch_result.float_status,
                 'opponents': dutch_result.opponents,
                 'colour_hist': dutch_result.colour_hist,
                 'results': prevResults }
    
    def _create_basic_dutch_player(self, player, ratingType, provisionalRating):
        return (Player(name=str(player['_id']), 
                       rating=player['fideRating'] or provisionalRating, 
                       title=player['fideTitle'] or 0)
                if ratingType == RatingType.fide
                else Player(name=str(player['_id']), 
                            rating=player['federationRating'] or provisionalRating, 
                            title=0))

    def _create_detailed_dutch_player(self, playerData):
        return Player(name=str(playerData['playerId']),
                       rating=playerData['rating'],
                       title=playerData['title'],
                       pairing_no=playerData['pairing_no'],
                       score=playerData['score'],
                       float_status=playerData['float_status'],
                       opponents=playerData['opponents'],
                       colour_hist=playerData['colour_hist'])