import unittest
from engines.pairing import SwissPairingEngine
from util.enums import PlaySystem, FideTitle

class Test_SwissPairingEngine(unittest.TestCase):
    def setUp(self):
        section = { 
            'playSystem': PlaySystem.swiss,
            'rounds': 5,
            'provisionalRating': 1000
        }
        players = [
            {
                'surname': 'Smith',
                'fideRating': 2200,
                'fideTitle': FideTitle.CM
            },
            {
                'surname': 'Bernstein',
                'fideRating': 1200,
                'fideTitle': None 
            },
            { 
                'surname': 'Adams',
                'fideRating': 1200,
                'fideTitle': None 
            },
            {
                'surname': 'Aronian',
                'fideRating': 2800,
                'fideTitle': FideTitle.GM
            },
            {
                'surname': 'Carlsen',
                'fideRating': 2900,
                'fideTitle': FideTitle.GM
            },
            {
                'surname': 'Jones',
                'fideRating': 2200,
                'fideTitle': FideTitle.WIM
            }

        ]
        self.engine = SwissPairingEngine(section, players)

    def test_rank_players(self):
        expected_ranked_players = [
            {
                'surname': 'Carlsen',
                'fideRating': 2900,
                'fideTitle': FideTitle.GM
            },
            {
                'surname': 'Aronian',
                'fideRating': 2800,
                'fideTitle': FideTitle.GM
            },
            {
                'surname': 'Jones',
                'fideRating': 2200,
                'fideTitle': FideTitle.WIM
            },
            {
                'surname': 'Smith',
                'fideRating': 2200,
                'fideTitle': FideTitle.CM
            },
            {
                'surname': 'Bernstein',
                'fideRating': 1200,
                'fideTitle': None 
            },
            { 
                'surname': 'Adams',
                'fideRating': 1200,
                'fideTitle': None 
            }
        ]
        self.engine.rank_players()
        self.assertEqual(self.engine.ranked_players, expected_ranked_players)