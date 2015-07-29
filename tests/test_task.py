from . import TestCase

from server.models import User, Message, Task
from server import db

class TestUser(TestCase):

    def test_basic(self):
        i = User(username='alice', email='alice@example.com')
        j = User(username='bob', email='bob@example.com')
        db.session.add(i)
        db.session.add(j)
        db.session.commit()

        t = Task(sender_id=i.id)
        db.session.add(t)
        db.session.commit()
        assert len(i.watched_tasks) == 0
        assert len(t.watcher.all()) == 0
        i.watch_task(t.id)
        assert len(i.watched_tasks) == 1
        assert len(t.watcher.all()) == 1




