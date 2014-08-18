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
        expected_pairs_odd_is_white = [
            (
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
            ),
            (
                {
                    'surname': 'Smith',
                    'fideRating': 2200,
                    'fideTitle': FideTitle.CM,
                    'pairingNum': 5
                },
                {
                    'surname': 'Aronian',
                    'fideRating': 2800,
                    'fideTitle': FideTitle.GM,
                    'pairingNum': 2 
                }
            ),
            (
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
            )
        ]
        expected_pairs_even_is_white = [
            (
                {
                    'surname': 'Jones',
                    'fideRating': 2200,
                    'fideTitle': FideTitle.WIM,
                    'pairingNum': 4 
                },
                {
                    'surname': 'Carlsen',
                    'fideRating': 2900,
                    'fideTitle': FideTitle.GM,
                    'pairingNum': 1 
                }
            ),
            (
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
            ),
            (
                { 
                    'surname': 'Adams',
                    'fideRating': 1200,
                    'fideTitle': None,
                    'pairingNum': 6
                },
                {
                    'surname': 'Silman',
                    'fideRating': 2400,
                    'fideTitle': FideTitle.IM,
                    'pairingNum': 3
                }
            )
        ]

        pinfo = self.engine.pair_first_round()
        self.assertEqual(pinfo['bye'], expected_bye)
        self.assertEqual(len(pinfo['pairs']), expected_len_pairs)
        expected_pairs = expected_pairs_even_is_white \
            if self.engine.even_is_white else expected_pairs_odd_is_white

        for i in range(expected_len_pairs):
            self.assertEqual(pinfo['pairs'][i], expected_pairs[i])
