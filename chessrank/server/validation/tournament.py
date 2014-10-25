import validation

class TournamentUpdateValidator(validation.Validator):
    def __init__(self, data):
        super().__init__(data)

        self._required = {
            'name': self._verify_name,
            'startDate': self._verify_start_and_end_dates,
            'endDate': lambda field, value: (True, None),
            'location': self._verify_name,
            'registrationFeeCurrencyId': self._verify_currency_id
        }

    def validate(self):
        spurious = set(self._data.keys()) - set(self._required.keys())
        if spurious:
            return (False, "Spurious fields included in request: {0}"
                    .format(', '.join(spurious)))

        return self._verify_required_fields()

    def _verify_required_fields(self):
        missing  = set(self._required.keys()) - set(self._data.keys())
        if missing:
            return (False, "Required field '{0}' missing"
                    .format(next(iter(missing))))

        for field in self._required:
            validate = self._required[field]
            result = validate(field, self._data[field])
            if not result[0]:
                return result

        return (True, None)

    def _verify_name(self, field, value):
        return ((True, None) if type(value) == str
                and len(value) > 1 and len(value) < 51
                else (False, "Field '{0}' must be between 2 and 50 characters long".format(field)))

    def _verify_start_and_end_dates(self, field, value):
        beg = self._data['startDate']
        end = self._data['endDate']

        return ((True, None) if beg < end
            else (False, "Field 'startDate' must be earlier than field 'endDate'"))

    def _verify_currency_id(self, field, value):
        return ((True, None) if value in range(1, 157) # TODO: Don't hard-code!
                else (False, 'Unknown currency'))
