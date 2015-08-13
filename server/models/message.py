from .. import db

from datetime import datetime

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    timestamp = db.Column(db.DateTime, index=True, default=datetime.now)
    type = db.Column(db.String) # enum? 'lab', 'database', 'task' 
    isread = db.Column(db.Boolean, default=False)

    #sender_id = db.Column(db.Integer)
    sender_id = db.Column(db.Integer)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    title = db.Column(db.String(128))
    content = db.Column(db.Text)


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
