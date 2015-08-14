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

    # in discussion
    #project_id = db.Column(db.Integer) 
    record = db.Column(db.Text)
    error_record = db.Column(db.Text)


    # change the plan time
    def change_plan_time(self, time):
        self.plan_time = time

        db.session.add(self)
        db.session.commit()
        return self

    # when it will end
    def get_end_time(self):
        return self.create_time + timedelta(minutes=self.time_scale)


