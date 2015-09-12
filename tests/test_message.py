# -*- coding: utf-8 -*-

from . import TestCase

from server.models import User, Message
from server import db

class TestMessage(TestCase):

    def test_basic(self):
        i = User(username='alice', email='alice@example.com')
        j = User(username='bob', email='bob@example.com')
        db.session.add(i)
        db.session.add(j)
        db.session.commit()

        m = i.send_message_to(j, title='Greeting', content='hello j')
        #assert Message.query.get(1).sender_id == i.id
        assert Message.query.get(1).receiver_id == j.id
        assert j.msg_box[0] == Message.query.get(1)
        assert m.receiver == j
        #assert len(i.sent_messages) == 1


