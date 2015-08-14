from .. import db

from datetime import datetime

watched_tasks = db.Table('watched_tasks',
    db.Column('task_id', db.Integer, db.ForeignKey('task.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'))
)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    timestamp = db.Column(db.DateTime, index=True, default=datetime.now)
    sender_id = db.Column(db.Integer, nullable=False)
    
    abstract = db.Column(db.Text)
    title = db.Column(db.String(128)) 
    content = db.Column(db.Text)

    comments = db.relationship('Comment', backref='task', lazy='dynamic')

    views = db.Column(db.Integer, default=0)
    votes = db.Column(db.Integer, default=0)

# try to add creator to watcher but fail for the recursive import
    def __init__(self, **kwargs):
        #u = User.query.get(kwargs['sender_id'])
        super(Task, self).__init__(**kwargs)
        #self.watcher.append(u)



