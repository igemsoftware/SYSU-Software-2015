# -*- coding: utf-8 -*-

from .. import db

from datetime import datetime

class Answer(db.Model):
    """Answer model in CORE.

    A :class:`Answer` is related to a :class:`Task`."""

    id = db.Column(db.Integer, primary_key=True)
    """ID is an unique number to identify each :class:`Answer`."""

    content = db.Column(db.Text)
    """Its content."""
    timestamp = db.Column(db.DateTime, index=True, default=datetime.now)
    """When this answer was created."""
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'))
    """The :attr:`Task.id` of the related task."""
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    """The :attr:`User.id` of the responder."""
    comments = db.relationship('Comment', backref='answer', lazy='dynamic')
    """The :class:`Comment` s of it.""" 

    def __repr__(self):
        return '<Answer[%d] by [%s]: %s>' % (self.id, self.owner.username, self.content[:50])


class Comment(db.Model):
    """Comment model in CORE.

    A :class:`Comment` is related to a :class:`Answer`."""

    id = db.Column(db.Integer, primary_key=True)
    """ID is an unique number to identify each :class:`Comment`."""

    content = db.Column(db.Text)
    """Its content."""

    timestamp = db.Column(db.DateTime, index=True, default=datetime.now)
    """When this comment was created."""
    answer_id = db.Column(db.Integer, db.ForeignKey('answer.id'))
    """The :attr:`Answer.id` of the related answer."""
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    """The :attr:`User.id` of the creator."""

    def __repr__(self):
        return '<Comment[%d] by [%s]: %s>' % (self.id, self.owner.username, self.content[:50])


class DesignComment(db.Model):
    """DesignComment model in CORE.

    A :class:`DesignComment` is related to a :class:`Design`."""


    id = db.Column(db.Integer, primary_key=True)
    """ID is an unique number to identify each :class:`DesignComment`."""

    content = db.Column(db.Text)
    """Its content."""
    timestamp = db.Column(db.DateTime, index=True, default=datetime.now)
    """When this comment was created."""
    design_id = db.Column(db.Integer, db.ForeignKey('design.id'))
    """The :attr:`Design.id` of related design."""
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    """The :attr:`User.id` of the creator."""

