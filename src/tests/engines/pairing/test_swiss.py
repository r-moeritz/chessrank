import unittest
from engines.pairing import SwissPairingEngine
from util.enums import PlaySystem, FideTitle

class Test_SwissPairingEngine(unittest.TestCase):
    def setUp(self):
        self.maxDiff = None
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
            },
            {
                'surname': 'Silman',
                'fideRating': 2400,
                'fideTitle': FideTitle.IM
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
                'surname': 'Silman',
                'fideRating': 2400,
                'fideTitle': FideTitle.IM
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
                'surname': 'Adams',
                'fideRating': 1200,
                'fideTitle': None 
            },
            {
                'surname': 'Bernstein',
                'fideRating': 1200,
                'fideTitle': None 
            }
        ]
        self.engine.rank_players()
        self.assertEqual(self.engine.ranked_players, expected_ranked_players)

    def test_pair_first_round(self):
        expected_bye = {
                'surname': 'Bernstein',
                'fideRating': 1200,
                'fideTitle': None,
                'pairingNum': 7 
            }
        expected_len_pairs = 3
        expected_pairs = [
            [
                {
                    'surname': 'Carlsen',
                    'fideRating': 2900,
                    'fideTitle': FideTitle.GM,
                    'pairingNum': 1 
                }, 
                {
                    'surname': 'Jones',
                    'fideRating': 2200,
                    'fideTitle': FideTitle.WIM,
                    'pairingNum': 4 
                }
            ],
            [
                {
                    'surname': 'Aronian',
                    'fideRating': 2800,
                    'fideTitle': FideTitle.GM,
                    'pairingNum': 2 
                },
                {
                    'surname': 'Smith',
                    'fideRating': 2200,
                    'fideTitle': FideTitle.CM,
                    'pairingNum': 5
                }
            ],
            [
                {
                    'surname': 'Silman',
                    'fideRating': 2400,
                    'fideTitle': FideTitle.IM,
                    'pairingNum': 3
                }, 
                { 
                    'surname': 'Adams',
                    'fideRating': 1200,
                    'fideTitle': None,
                    'pairingNum': 6
                }
            ]
        ]
        pinfo = self.engine.pair_first_round()
        self.assertEqual(pinfo['bye'], expected_bye)
        self.assertEqual(len(pinfo['pairs']), expected_len_pairs)
        for i in range(expected_len_pairs):
            self.assertCountEqual(pinfo['pairs'][i], expected_pairs[i])
