import abc
from tornado import gen

class Engine(metaclass=abc.ABCMeta):
    @abc.abstractclassmethod
    def __init__(self, settings):
        self._settings = settings

    @abc.abstractmethod
    @gen.coroutine
    def execute(self, data):
        pass