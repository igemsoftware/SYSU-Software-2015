from .. import db

tracks = db.Table('tracks',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('track_id', db.Integer, db.ForeignKey('track.id'))
)

class Track(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(128), unique=True)
    pic_url = db.Column(db.Text)

