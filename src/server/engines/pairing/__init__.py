import operator
import math
import random

class SwissPairingEngine:
    def __init__(self, section, players):
        self.section = section
        self.players = players

    def rank_players(self):
        self.ranked_players = sorted(self.players, 
                                     key=operator.itemgetter('surname'))
        self.ranked_players.sort(key=operator.itemgetter('fideRating', 'fideTitle'),
                                 reverse=True)

    def assign_pairing_numbers(self):
        for i in range(len(self.ranked_players)):
            p = self.ranked_players[i]
            p['pairingNum'] = i + 1

    def pair_first_round(self):
        self.rank_players()
        self.assign_pairing_numbers()

        k = math.floor(len(self.ranked_players)/2)
        s1 = self.ranked_players[:k]
        s2 = self.ranked_players[k:]

        pairs = [random.sample([s1.pop(0), s2.pop(0)], 2)
                 for i in range(k)]
        return { 'pairs': pairs, 'bye': s2[0] if s2 else None }