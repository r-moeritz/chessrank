import operator
import math
import random

class SwissPairingEngine:
    def __init__(self, section, players):
        self.section = section
        self.players = players
        self.even_is_white = random.randint(0, 1)

    def rank_players(self):
        self.ranked_players = sorted(self.players, 
                                     key=operator.itemgetter('surname'))
        self.ranked_players.sort(key=operator.itemgetter('fideRating', 'fideTitle'),
                                 reverse=True)

    def assign_pairing_numbers(self):
        for i in range(len(self.ranked_players)):
            p = self.ranked_players[i]
            p['pairingNum'] = i + 1

    def assign_colours(self, p1, p2):
        odd,even = (p1,p2) if p1['pairingNum'] % 2 else (p2,p1)
        return (even,odd) if self.even_is_white else (odd,even)

    def pair_first_round(self):
        self.rank_players()
        self.assign_pairing_numbers()

        k = math.floor(len(self.ranked_players)/2)
        s1 = self.ranked_players[:k]
        s2 = self.ranked_players[k:]

        pairs = [self.assign_colours(s1.pop(0), s2.pop(0))
                 for i in range(k)]
        return { 'pairs': pairs, 'bye': s2[0] if s2 else None }