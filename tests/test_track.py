# -*- coding: utf-8 -*-

from . import TestCase

from server.models import User, Track 
from server import db

class TestTrack(TestCase):

    def test_basic(self):
        u = User(username='alice', email='alice@example.com')
        db.session.add(u)
        db.session.commit()

        t1 = Track(name='T1')
        t2 = Track(name='T2')
        db.session.add(t1)
        db.session.add(t2)
        db.session.commit()

        assert len(u.tracks) == 0
        assert len(t1.user.all()) == 0
        u.tracks.append(t1)
        assert len(u.tracks) == 1
        assert len(t1.user.all()) == 1



