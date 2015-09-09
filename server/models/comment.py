# -*- coding: utf-8 -*-

from .. import db

from datetime import datetime

class Answer(db.Model):
    """Comment model in CORE.

    A :class:`Comment` is related to a :class:`Task`."""

    id = db.Column(db.Integer, primary_key=True)
    """ID is an unique number to identify each :class:`Comment`."""

    content = db.Column(db.Text)

    timestamp = db.Column(db.DateTime, index=True, default=datetime.now)
    """When this comment was created."""
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'))
    """The :attr:`Task.id` of related task."""
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    """The :attr:`User.id` of sender."""
    comments = db.relationship('Comment', backref='answer', lazy='dynamic')

    def __repr__(self):
        return '<Answer[%d] by [%s]: %s>' % (self.id, self.owner.username, self.content[:50])


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    content = db.Column(db.Text)

    timestamp = db.Column(db.DateTime, index=True, default=datetime.now)
    answer_id = db.Column(db.Integer, db.ForeignKey('answer.id'))
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Comment[%d] by [%s]: %s>' % (self.id, self.owner.username, self.content[:50])

