# -*- coding: utf-8 -*-

from .. import db

from datetime import datetime, timedelta

class Memo(db.Model):
    """Memo model in CORE."""

    id = db.Column(db.Integer, primary_key=True)
    """ID is an unique number to identify each :class:`Memo`."""

    title = db.Column(db.String(32))
    """Its title, which will be shown in calendar"""
    content = db.Column(db.Text)
    """Its content."""

    create_time = db.Column(db.DateTime, index=True, default=datetime.now)
    """When this memo was created."""
    plan_time = db.Column(db.DateTime, default=datetime.now) # now
    """When the event will happen."""
    time_scale = db.Column(db.Integer) # in minutes
    """How long the event lasts. It's described in minutes."""
    message_sent = db.Column(db.Boolean, default=False)
    """Has CORE sent a :class:`Message` to remind the :class:`User`."""

    # the user id
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id')) 
    """The :attr:`User.id` of owner."""

    # records
    protocol = db.Column(db.Text, default='')
    """The protocols this memo contains."""
    record = db.Column(db.Text, default='')
    """The record this memo contains."""
    error = db.Column(db.Text, default='')
    """The error this memo contains."""

    @property
    def end_time(self):
        """Calculate the time of endding by adding :attr:`plan_time` and :attr:`time_scale`"""
        return self.plan_time + timedelta(minutes=self.time_scale)

    def calendar_jsonify(self):
        """Tranfer it into a json.
        
        :id: See :attr:`id`.
        :start: See :attr:`plan_time`. Its format is "year/month/day hour:minute".
        :end: See :attr:`end_time`. Its format is "year/month/day hour:minute".
        :title: See :attr:`title`.
        :protocol: See :attr:`protocol`.
        :record: See :attr:`record`.
        :error: See :attr:`error`.
        """
        return {
                'id': self.id,
                'start': self.plan_time.strftime('%Y/%m/%d %H:%M'),   #'2015/09/09 00:24'
                'end': self.end_time.strftime('%Y/%m/%d %H:%M'),   #'2015/09/09 00:24'
                'title': self.title,
                'protocol': self.protocol,
                'record': self.record,
                'error': self.error,
               }

    # change the plan time by front-end in CORE
    def change_plan_time(self, time):
        self.plan_time = time

        db.session.add(self)
        db.session.commit()
        return self


