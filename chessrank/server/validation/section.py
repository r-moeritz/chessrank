import validation

from util.enums import SectionRegistrationAction

class SectionRegistrationValidator(validation.Validator):
    def __init__(self, data):
        super().__init__(data)

    def validate(self):
        action = self._data.get('action', None)
        if action is None:
            return (False, "Required field 'action' missing")

        if action not in set(SectionRegistrationAction):
            return (False, "Field 'action' must be either 0 or 1")

        return (True, None)

class SectionUpdateValidator(validation.Validator):
    def __init__(self, data):
        super().__init__(data)

    def validate(self):
        return (False, 'Feature not yet implemented')
