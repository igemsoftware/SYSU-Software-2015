from . import TestCase

from server.models import User
from server import db

class TestUser(TestCase):

    def test_register(self):
        u = User(username='testing', email='foo@example.com', password='123')
        db.session.add(u)
        db.session.commit()
        assert u in db.session

    def test_unique(self):
        u = User(username='testing', email='foo@example.com', password='123')
        db.session.add(u)
        db.session.commit()

        from sqlalchemy.exc import IntegrityError
        u = User(username='testing', email='bar@example.com', password='123')
        self.assertRaises(IntegrityError , db.session.add(u))



