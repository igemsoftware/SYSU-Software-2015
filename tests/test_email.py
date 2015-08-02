from . import TestCase

from server.models import User
from server import db
from server.tools.email import _send_raw_email 

class TestEmail(TestCase):

    def test_sending(self):
        _send_raw_email('hapiscesdream@163.com', 'Hi', 'Hello world')

    def test_register_email(self):
        u = User(username='testing', email='hapiscesdream@163.com', password='123')
        db.session.add(u)
        db.session.commit()

