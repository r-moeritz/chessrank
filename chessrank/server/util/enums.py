from enum import IntEnum

class PlaySystem(IntEnum):
    round_robin = 0
    double_round_robin = 1
    swiss = 2

class TieBreak(IntEnum):
    neustadl = 0
    buchholz = 1
    median = 2
    modified_median = 3

class FideTitle(IntEnum):
    WCM = 0
    WFM = 1
    CM = 2
    WIM = 3
    FM = 4
    WGM = 5
    IM = 6
    GM = 7