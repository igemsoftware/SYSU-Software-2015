# -*- coding: utf-8 -*-

from .. import db

from datetime import datetime

class Message(db.Model):
    """Message model in CORE.

    A :class:`Message` can be send by :class:`User` or the CORE's
    reminder in taskhall or calendar."""

    id = db.Column(db.Integer, primary_key=True)
    """ID is an unique number to identify each :class:`Message`."""

    timestamp = db.Column(db.DateTime, index=True, default=datetime.now)
    """When this message was created."""
    source = db.Column(db.String) 
    """Where this message was created.
    
    :Exeperiment Reminders: From experiment reminder.
    :Exeperiment Records: From experiment recorder.
    :Database: From CORE Bank.
    :Taskhall: From Co-development.
    """
    # Experiment Reminders, Experiment Records, Database, Taskhall
    isread = db.Column(db.Boolean, default=False)
    """Whether it has been read."""

    #sender_id = db.Column(db.Integer)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    """The :attr:`User.id` of receiver."""

    title = db.Column(db.String(128))
    """Its title."""
    content = db.Column(db.Text)
    """Its content."""

    def __repr__(self):
        return '<Message[%d]: from %r to %r>' % (self.id, self.sender_id, self.receiver_id)

#   message_send = db.Table('message_send',
#       db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
#       db.Column('message_id', db.Integer, db.ForeignKey('message.id')),
#   )
#   message_recv = db.Table('message_recv',
#       db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
#       db.Column('message_id', db.Integer, db.ForeignKey('message.id')),
#   )
