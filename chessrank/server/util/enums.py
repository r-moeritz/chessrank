import enum

class PlaySystem(enum.IntEnum):
    round_robin = 0
    double_round_robin = 1
    swiss = 2

class TieBreak(enum.IntEnum):
    neustadl = 0
    buchholz = 1
    median = 2
    modified_median = 3

class FideTitle(enum.IntEnum):
    WCM = 0
    WFM = 1
    CM = 2
    WIM = 3
    FM = 4
    WGM = 5
    IM = 6
    GM = 7

class UserStatus(enum.IntEnum):
    unconfirmed = 0,
    active = 1,
    disabled = 2

class SectionRegistrationAction(enum.IntEnum):
    register = 0,
    unregister = 1

class TimeControlBonus(enum.IntEnum):
    increment = 0,
    delay = 1
