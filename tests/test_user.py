# -*- coding: utf-8 -*-

from . import TestCase

from server.models import User
from server import db

class TestUser(TestCase):

    def test_register(self):
        u = User(username='testing', email='foo@example.com', password='123')
        db.session.add(u)
        db.session.commit()
        assert u in db.session

    def test_name_unique(self):
        u = User(username='testing', email='foo@example.com', password='123')
        db.session.add(u)
        db.session.commit()

        from sqlalchemy.exc import IntegrityError
        u = User(username='testing', email='bar@example.com', password='123')
        def register_duplicated_name():
            db.session.add(u)
            db.session.commit()
        self.assertRaises(IntegrityError , register_duplicated_name)

    def test_name_length(self):
        u = User(username='i'*300, email='foo@example.com', password='123')
        db.session.add(u)
        db.session.commit()
        
        assert len(u.username) <= 128




