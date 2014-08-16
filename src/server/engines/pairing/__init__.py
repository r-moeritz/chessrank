import operator

class SwissPairingEngine:
    def __init__(self, section, players):
        self.section = section
        self.players = players

    def rank_players(self):
        self.ranked_players = sorted(self.players, 
                                     key=operator.itemgetter('fideRating', 'fideTitle', 'surname'), 
                                     reverse=True)

    def pair_first_round(self):
        self.rank_players()