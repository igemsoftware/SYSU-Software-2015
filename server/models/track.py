# -*- coding: utf-8 -*-

from .. import db

tracks = db.Table('tracks',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('track_id', db.Integer, db.ForeignKey('track.id'))
)

class Track(db.Model):
    """Memo model in Track."""

    id = db.Column(db.Integer, index=True, primary_key=True)
    """ID is an unique number to identify each :class:`Track`."""

    name = db.Column(db.String(128), unique=True)
    """Its name."""
    description = db.Column(db.Text, default='')
    """Its descriptions."""

