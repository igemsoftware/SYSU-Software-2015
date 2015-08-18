# -*- coding: utf-8 -*-

from . import TestCase

from server.models import User, Task, Comment
from server import db

class TestComment(TestCase):

    def test_basic(self):
        u = User(username='alice', email='alice@example.com')
        db.session.add(u)
        db.session.commit()

        t = u.create_task('I want to test', 'a test', 'I want to test the test part.') 
        c = u.make_comment(t.id, 'Testing')
        assert c.id is not None
        assert c in t.comments





