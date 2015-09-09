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
    active_time = db.Column(db.DateTime, default=datetime.now)
    """Last update."""
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    """Who this task was created by."""
    
    abstract = db.Column(db.Text)
    """Its short abstract."""
    title = db.Column(db.String(128)) 
    """Its title."""
    content = db.Column(db.Text)
    """Its content."""

    answers = db.relationship('Answer', backref='task', lazy='dynamic')
    """Its :class:`Comment`."""

    views = db.Column(db.Integer, default=0)
    """How many views it got."""
    votes = db.Column(db.Integer, default=0)
    """How many votes it got."""

    def jsonify(self):
        return {
                'id':self.id,
                'title':self.title,
                'content':self.content,
                'timestamp': (self.timestamp - datetime.utcfromtimestamp(0)).total_seconds(),
                'views' : self.views,
                'votes' : self.votes,
                'answers':self.answers.count(),
                        #.strftime('%H:%M %d %b, %Y'),
                'author': { 
                        'name': self.owner.username,
                        'avatar': self.owner.avatar or '/static/img/avatar.jpg',
                        'question': self.owner.tasks.count(),
                        'answer': self.owner.answers.count(),
                        'shared': self.owner.designs.filter_by(is_shared=True).count(),
                        'tracks': [x.name for x in self.owner.tracks]
                    } 
               }


# try to add creator to watcher but fail for the recursive import
    def __init__(self, **kwargs):
        #u = User.query.get(kwargs['sender_id'])
        super(Task, self).__init__(**kwargs)
        #self.watcher.append(u)



