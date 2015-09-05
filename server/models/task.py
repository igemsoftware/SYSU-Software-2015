# -*- coding: utf-8 -*-

from .. import db

from datetime import datetime

watched_tasks = db.Table('watched_tasks',
    db.Column('task_id', db.Integer, db.ForeignKey('task.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'))
)

class Task(db.Model):
    """Task model in CORE.""" 

    id = db.Column(db.Integer, primary_key=True)
    """ID is an unique number to identify each :class:`Task`."""

    timestamp = db.Column(db.DateTime, index=True, default=datetime.now)
    """When this task was created."""
    sender_id = db.Column(db.Integer, nullable=False)
    """Who this task was created by."""
    
    abstract = db.Column(db.Text)
    """Its short abstract."""
    title = db.Column(db.String(128)) 
    """Its title."""
    content = db.Column(db.Text)
    """Its content."""

    comments = db.relationship('Comment', backref='task', lazy='dynamic')
    """Its :class:`Comment`."""

    views = db.Column(db.Integer, default=0)
    """How many views it got."""
    votes = db.Column(db.Integer, default=0)
    """How many votes it got."""

# try to add creator to watcher but fail for the recursive import
    def __init__(self, **kwargs):
        #u = User.query.get(kwargs['sender_id'])
        super(Task, self).__init__(**kwargs)
        #self.watcher.append(u)



