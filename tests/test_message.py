from . import TestCase

from server.models import User, Message
from server import db

class TestUser(TestCase):

    def test_basic(self):
        i = User(username='alice', email='alice@example.com')
        j = User(username='bob', email='bob@example.com')
        db.session.add(i)
        db.session.add(j)
        db.session.commit()

        i.send_message_to('Greeting', 'hello j', j)
        assert Message.query.get(1).sender_id == i.id
        assert Message.query.get(1).receiver_id == j.id
        assert j.recv_messages[0] == Message.query.get(1)


