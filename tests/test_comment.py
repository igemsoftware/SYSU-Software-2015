# -*- coding: utf-8 -*-

from . import TestCase

from server.models import User, Task, Comment, Answer, DesignComment, Design
from server import db

class TestComment(TestCase):

    def test_comments(self):
        u = User(username='alice', email='alice@example.com')
        db.session.add(u)

        t = u.create_task(title='I want to test', abstract='a test', content='I want to test the test part.') 
        db.session.add(t)
        a = u.answer_a_task(t, 'Testing')
        c = u.comment_an_answer(a, 'Testing')

        assert c.id is not None
        assert c in a.comments
        assert a in t.answers

        d = Design()
        db.session.add(d)
        c = DesignComment(content="I gonna use it")
        c.owner = u
        c.design = d

        assert c in d.comments
        assert c in u.designComments




