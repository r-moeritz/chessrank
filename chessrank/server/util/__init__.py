import functools
import tornado.web

from urllib.parse import urlencode
from tornado import gen

def authenticated_async(func):
    @functools.wraps(func)
    @gen.coroutine
    def wrapper(self, *args, **kwargs):
        self.current_user = yield self.get_current_user_async()
        if not self.current_user:
            raise tornado.web.HTTPError(401)
        else:
            yield func(self, *args, **kwargs)
    
    return wrapper