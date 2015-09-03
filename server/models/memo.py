# -*- coding: utf-8 -*-

from .. import db

from datetime import datetime, timedelta

class Memo(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    # title of the memo, used in calendar cell
    title = db.Column(db.String(32))
    # the content of memo
    content = db.Column(db.Text)

    # when the memo is created
    create_time = db.Column(db.DateTime, index=True, default=datetime.now)
    # when I want to start
    plan_time = db.Column(db.DateTime, default=datetime.now) # now
    # how long it takes
    time_scale = db.Column(db.Integer) # in minutes
    # whether the system has sent a message to user
    message_sent = db.Column(db.Boolean, default=False)

    # the user id
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id')) 

    # records
    protocol = db.Column(db.Text, default='')
    record = db.Column(db.Text, default='')
    error = db.Column(db.Text, default='')

    @property
    def end_time(self):
        return self.create_time + timedelta(minutes=self.time_scale)

    def calendar_jsonify(self):
        return {
                'id': self.id,
                'start': self.plan_time.strftime('%Y/%m/%d %H:%M'),   #'2015/09/09 00:24'
                'end': self.end_time.strftime('%Y/%m/%d %H:%M'),   #'2015/09/09 00:24'
                'title': self.title,
                'protocol': self.protocol,
                'record': self.record,
                'error': self.error,
               }

    # change the plan time
    # front-end 
    def change_plan_time(self, time):
        self.plan_time = time

        db.session.add(self)
        db.session.commit()
        return self


