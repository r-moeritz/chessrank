import abc

class Validator(metaclass=abc.ABCMeta):
    @abc.abstractclassmethod
    def __init__(self, data):
        self._data = data

    @abc.abstractmethod
    def validate(self):
        pass