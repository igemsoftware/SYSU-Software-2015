from . import TestCase

from server.models import User, Task, Comment, Memo
from server import db

class TestMemo(TestCase):

    def test_admin(self): 
        u = User.query.get(1)
        assert u.username=='Administrator'

    def test_memo(self):
        u = User(username='alice', email='hapiscesdream@163.com', password='a')
        db.session.add(u)
        db.session.commit()

        m = u.add_memo('Sleep', 'I want to sleep', 60*8)
        assert m.id is not None # added into db

        assert len(u.recv_messages.all()) == 0
        u.check_memo()
        assert len(u.recv_messages.all()) == 1

        u.check_memo()
        assert len(u.recv_messages.all()) == 1






