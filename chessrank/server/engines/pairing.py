import engines

from tornado import gen
from swissdutch.dutch import DutchPairingEngine

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
        self._dutch = DutchPairingEngine()

    @gen.coroutine
    def execute(self, data):
        db = self._settings['db']

        # TODO:
        # 1. Find users confirmed registered for section
        # 2. Extract data and create Player objects
        # 3. call self._dutch.pair_round() with Player objects
        # 4. Update section.roundData and write to db
        # 5. Return updated section

        #userIds = self._section['confirmedUserIds']

