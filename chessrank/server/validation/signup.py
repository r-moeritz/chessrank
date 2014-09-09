import re
import dateutil.parser
from datetime import datetime
from dateutil.relativedelta import relativedelta
from validation import Validator
from util.enums import FideTitle

class SignupValidator(Validator):
    def __init__(self, data):
        super().__init__(data)

        self._required = {
            'name': self._verify_name, 
         'surname': self._verify_name, 
          'gender': self._verify_gender, 
           'email': self._verify_email 
        }
        self._optional = {
            'dateOfBirth': self._verify_date_of_birth, 
          'contactNumber': self._verify_telno, 
             'fideRating': self._verify_rating, 
              'fedRating': self._verify_rating,
              'fideTitle': self._verify_fide_title
        }

    def validate(self):
        result = self._verify_required_fields()
        if not result[0]:
            return result

        result = self._verify_optional_fields()
        return result

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

    def _verify_optional_fields(self):
        for field in self._optional:
            if field in self._data:
                validate = self._optional[field]
                result = validate(field, self._data[field])
                if not result[0]:
                    return result

        return (True, None)

    @staticmethod
    def _verify_name(field, value):
        return ((True, None) if type(value) == str
                and len(value) > 1 and len(value) < 51
                else (False, "Field '{0}' must be between 2 and 50 characters long".format(field)))

    @staticmethod
    def _verify_email(field, value):
        return ((True, None) if type(value) == str 
                and re.fullmatch(r'^[\w\.\+]+@\w+\.\w+$', value)
                else (False, "Field '{0}' must be a valid email address".format(field)))

    @staticmethod
    def _verify_gender(field, value):
        return ((True, None) if value in ('0', '1')
                else (False, "Field '{0}' must be either '0' or '1'".format(field)))

    @staticmethod
    def _verify_telno(field, value):
        return ((True, None) if type(value) == str
                and re.fullmatch(r'^\+\d{11}$', value)
                else (False, "Field '{0}' must be a valid telephone number".format(field)))

    @staticmethod
    def _verify_date_of_birth(field, value):
        dob = dateutil.parser.parse(value)
        now = datetime.now()
        min = now - relativedelta(years=120)
        max = now - relativedelta(years=4)
        return ((True, None) if dob > min and dob < max
                else (False, "Field '{0}' must be a date at least 4 years and at most 120 years in the past"
                      .format(field)))

    @staticmethod
    def _verify_rating(field, value):
        return ((True, None) if type(value) == int and value > 0
                else (False, "Field '{0}' must be a positive integer".format(field)))

    @staticmethod
    def _verify_fide_title(field, value):
        return ((True, None) if value in list(FideTitle)
                else (False, "Field '{0}' must be an integer between 0 and 7".format(field)))