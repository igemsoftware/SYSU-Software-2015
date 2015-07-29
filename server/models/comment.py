from .. import db

from datetime import datetime

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    content = db.Column(db.Text)

    timestamp = db.Column(db.DateTime, index=True, default=datetime.now)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'))
    sender_id = db.Column(db.Integer)


