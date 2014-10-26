import enum

class PlaySystem(enum.IntEnum):
    round_robin = 1
    double_round_robin = 2
    swiss = 3

class TieBreak(enum.IntEnum):
    neustadl = 0
    buchholz = 1
    median = 2
    modified_median = 3

class FideTitle(enum.IntEnum):
    WCM = 1,
    WFM = 2,
    CM = 3,
    WIM = 4,
    FM = 5,
    WGM = 6,
    IM = 7,
    GM = 8

class UserStatus(enum.IntEnum):
    unconfirmed = 0,
    active = 1,
    disabled = 2

class SectionRegistrationAction(enum.IntEnum):
    register = 0,
    unregister = 1

class SectionOwnerAction(enum.IntEnum):
    update_section = 0,
    pair_round = 1,
    capture_results = 2,
    confirm_registrations = 3

class TimeControlBonus(enum.IntEnum):
    increment = 1,
    delay = 2

class RatingType(enum.IntEnum):
    fide = 1,
    federation = 2

class Gender(enum.IntEnum):
    male = 1,
    female = 2

class RoundStatus(enum.IntEnum):
    unpaired = 0,
    paired = 1,
    completed = 2

class GameResult(enum.IntEnum):
    black_wins = 0,
    white_wins = 1,
    draw = 2,
    black_forfeits = 3,
    white_forfeits = 4,
    both_forfeit = 5,
    bye = 6
