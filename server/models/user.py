from .. import db
from .. import login_manager

from message import Message
from task import watched_tasks, Task
from memo import Memo
from comment import Comment
from track import Track, tracks
from synbio import Favorite_circuit

from datetime import datetime, timedelta
from flask.ext.login import UserMixin

from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
import random, string

from ..tools.email import _send_email


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)

    # basic info
    username = db.Column(db.String(128), nullable=False, unique=True)
    email = db.Column(db.String(128), unique=True)
    avatar = db.Column(db.String()) # url

    # password
    password_hash = db.Column(db.String(32)) 
    salt = db.Column(db.String(32))

    # record
    reg_date = db.Column(db.DateTime, default=datetime.now)
    last_seen = db.Column(db.DateTime, default=datetime.now)

    def __init__(self, async_mail=True, send_email=True, **kwargs):
        kwargs['username'] = kwargs['username'][:128]
        super(User, self).__init__(**kwargs)
        if self.username != "Administrator" and send_email:
            self.send_email(subject='Welcome to FLAME', template='email/greeting',
                            user=self, async=async_mail)

    def ping(self):
        last_seen = datetime.now()
        db.session.add(self)

    # password
    @property
    def password(self):
        return "You should not see it"

    @password.setter
    def password(self, value):
        self.salt = ''.join([random.choice(string.ascii_letters + string.digits) for n in xrange(32)])
        self.password_hash = generate_password_hash(value+self.salt)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password+self.salt)


    # messages
    msg_box = db.relationship('Message', backref='receiver', lazy='dynamic')

    def send_message_to(self, user, **kwargs):
        msg = Message(isread=False, receiver_id=user.id, source='User', **kwargs) #sender_id=self.id,
        db.session.add(msg)
        db.session.commit()
        return msg

    @property
    def sent_messages(self):
        return Message.query.filter(Message.sender_id==self.id).all()

    # tasks
    watched_tasks = db.relationship('Task', secondary=watched_tasks, backref=db.backref('watcher', lazy='dynamic'))

    def create_task(self, **kwargs):
        t = Task(watcher=[self], sender_id=self.id, **kwargs)
        db.session.add(t)
        db.session.commit()
        return t

    def watch_task(self, task):
        self.watched_tasks.append(task)
        db.session.add(self)
        db.session.commit()

    # comment
    def make_comment(self, task_id, content):
        c = Comment(content=content, task_id=task_id, sender_id=self.id)
        db.session.add(c)
        db.session.commit()
        return c

    def __repr__(self):
        return '<User[%d]: %r>' % (self.id, self.username)

    # email
    def send_email(self, subject, template, **kwargs):
        _send_email(self.email, subject, template, **kwargs)

    # calendar

    # calendar memos
    memos = db.relationship('Memo', backref='owner', lazy='dynamic')
    # before how long should we notify user ( in minutes )
    memo_ahead = db.Column(db.Integer, default=60*6) # 6 hour ahead
    # whether we send an email to user
    memo_email = db.Column(db.Boolean, default=True)

    def add_memo(self, **kwargs):#title, content, timescale):
        m = Memo(**kwargs)
        #title = title, content=content, timescale=timescale)
        self.memos.append(m)

        db.session.add(m)
        db.session.add(self)
        db.session.commit()
        return m

    def check_memo(self):
        td = timedelta(minutes=self.memo_ahead)
        for m in self.memos:
            if m.message_sent == True: continue
            if (datetime.now()+td > m.plan_time):
                # send via administrator
                User.query.get(1).send_message_to(self, title='Notice: [%s]' % m.title, 
                    content='Memo: [%s...] is about to happen.' % m.content[:20])

                # send email if needed
                if self.memo_email == True:
                    self.send_email('Notice: [%s]' % m.title, 'email/memo', memo=m, user=self)

                m.message_sent = True

    def get_memos_during(self, start_time, end_time):
        return self.memos.filter(start_time < Memo.plan_time, Memo.plan_time < end_time).all()

    # track
    tracks = db.relationship('Track', secondary=tracks, backref=db.backref('user', lazy='dynamic')) 

    # favoriate circuit
    favorite_circuits = db.relationship('Circuit', secondary=Favorite_circuit, backref=db.backref('user', lazy='dynamic'))
    circuits = db.relationship('Circuit', backref='owner', lazy='dynamic')





    # confirmed
#    confirmed = db.Column(db.Boolean, default=False)
    #confirm_token = db.Column(db.String(128))

#   # confirmation
#   def generate_confirmation_token(self, expiration=3600):
#       s = Serializer(current_app.config['SECRET_KEY'], expiration, salt=self.salt)
#       return s.dumps({'confirm':self.id})

#   def confirm(self,token):
#       s = Serializer(current_app.config['SECRET_KEY'], salt=self.salt)
#       try:
#           data = s.loads(token)
#       except:
#           return False
#       if data.get('confirm') != self.id:
#           return False
#       self.confirmed = True
#       db.session.add(self)
#       return True

#   def send_confirmation(self):
#       self.confirmed = False
#       token = self.generate_confirmation_token()
#       # not complete
#       send_email(self.email, 'please comfirm your email.',
#                   'auth/email/confirm', user=self, token=token)
#       flash('Comfirmation email has been sent.')


#   # change email 
#   def generate_email_change_token(self, new_email, expiration=3600):
#       s = Serializer(current_app.config['SECRET_KEY'], expiration)
#       return s.dumps({'change_email': self.id, 'new_email': new_email})

#   def change_email(self, token):
#       s = Serializer(current_app.config['SECRET_KEY'])
#       try:
#           data = s.loads(token)
#       except:
#           return False
#       if data.get('change_email') != self.id:
#           return False
#       new_email = data.get('new_email')
#       if new_email is None:
#           return False
#       self.confirmed = True
#       #self.email = new_email
#       db.session.add(self)
#       return True
#   def send_change_email(self, new_email):
#       token = self.generate_email_change_token(new_email)
#       send_email(new_email, 'Please comfirm your email.',
#                   'auth/email/change_email', user=self, token=token)
#       flash('Comfirmation email has been sent.')

#   # reset password
#   def generate_reset_token(self, expiration=3600):
#       s = Serializer(current_app.config['SECRET_KEY'], expiration, salt=self.salt)
#       return s.dumps({'reset':self.id})
#   def reset_password(self, token, new_password):
#       s = Serializer(current_app.config['SECRET_KEY'], salt=self.salt)
#       try:
#           data = s.loads(token)
#       except:
#           return False
#       if data.get('reset') != self.id:
#           return False
#       self.password = new_password
#       db.session.add(self)
#       return True
#   def send_reset_email(self):
#       token = self.generate_reset_token()
#       send_email(self.email, 'reset the password',
#                  'auth/email/reset_password', user=self, token=token)
#       flash('Reset comfirm email has been sent')

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))




from flask.ext.login import AnonymousUserMixin

class AnonymousUser(AnonymousUserMixin):
    pass 

login_manager.anonymous_user = AnonymousUser


