# -*- coding: utf-8 -*-

from .. import db

from datetime import datetime

class Comment(db.Model):
    """Comment model in CORE.

    A :class:`Comment` is related to a :class:`Task`."""

    id = db.Column(db.Integer, primary_key=True)
    """ID is an unique number to identify each :class:`Comment`."""

    content = db.Column(db.Text)

    timestamp = db.Column(db.DateTime, index=True, default=datetime.now)
    """When this comment was created."""
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'))
    """The :attr:`Task.id` of related task."""
    sender_id = db.Column(db.Integer)
    """The :attr:`User.id` of sender."""


