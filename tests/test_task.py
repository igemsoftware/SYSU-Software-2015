# -*- coding: utf-8 -*-

from . import TestCase

from server.models import User, Task
from server import db

class TestTask(TestCase):

    def test_basic(self):
        i = User(username='alice', email='alice@example.com')
        j = User(username='bob', email='bob@example.com')
        db.session.add(i)
        db.session.add(j)
        db.session.commit()

        t = i.create_task('I want to test', 'a test', 'I want to test the test part.') 
#        db.session.add(t)
#        db.session.commit()
        assert len(i.watched_tasks) == 1
        assert len(t.watcher.all()) == 1
        j.watch_task(t.id)
        assert len(i.watched_tasks) == 1
        assert len(t.watcher.all()) == 2
        assert j in t.watcher.all()



