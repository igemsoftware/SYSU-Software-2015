# -*- coding: utf-8 -*-
from .. import db
from .. import login_manager

from message import Message
from task import watched_tasks, Task
from memo import Memo
from comment import Comment, Answer
from track import Track, tracks
from synbio import Favorite_design

from datetime import datetime, timedelta
from flask.ext.login import UserMixin

from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
import random, string

from ..tools.email import _send_email


class User(UserMixin, db.Model):
    """User model in CORE.

    A default user named `administrator` is added when initializing.""" 
    
    id = db.Column(db.Integer, primary_key=True)  
    """ID is an unique number to identify each :class:`User`."""

    # Basic info
    username = db.Column(db.String(128), nullable=False, unique=True)
    """The length of username should be shorter than 128 and larger than 0.

    If a oversize username is typed, it will automatically truncated to 128 long.
    """
    email = db.Column(db.String(128), unique=True)
    """Email is used to remind the user about his experiments (or to retrieve his password)."""
    avatar = db.Column(db.String()) # url
    """The URL of user's avatar."""

    # password
    password_hash = db.Column(db.String(32)) 
    """Password will be hashed with :attr:`salt` and stored here."""
    salt = db.Column(db.String(32))
    """Salt for :attr:`password_hash`."""
    @property
    def password(self):
        """The way to assign a password.
        
        :getter: A warning string will be return.
        :setter: Randomly create a :attr:`salt`, which will be used to generate :attr:`password_hash`.
        :type: string"""
        return "You should not see it"

    @password.setter
    def password(self, value):
        self.salt = ''.join([random.choice(string.ascii_letters + string.digits) for n in xrange(32)])
        self.password_hash = generate_password_hash(value+self.salt)

    def verify_password(self, password):
        """Verify the given password with stored :attr:`salt`."""
        return check_password_hash(self.password_hash, password+self.salt)

    # record
    reg_date = db.Column(db.DateTime, default=datetime.now)
    """Registration time."""
    last_seen = db.Column(db.DateTime, default=datetime.now)
    """Last login time."""
    def ping(self):
        """Update the last login time."""
        last_seen = datetime.now()
        db.session.add(self)

    def __init__(self, async_mail=True, send_email=True, **kwargs):
        """When initialize a :class:`User`, the administrator will send a 
        greeting email by default.
        
        :async_mail: Use another thread to send email. When set to ``False``, the server might \
        go wrong if something goes wrong with the sending procedure. It should be ``True`` during\
        the runing time.
        :send_email: Whether send an email or not."""
        kwargs['username'] = kwargs['username'][:128]
        super(User, self).__init__(**kwargs)
        if self.username != "Administrator" and send_email:
            self.send_email(subject='Welcome to CORE', template='email/greeting',
                            user=self, async=async_mail)

    # messages
    msg_box = db.relationship('Message', backref='receiver', lazy='dynamic')
    """The received :class:`Message`.""" 


    def send_message_to(self, user, **kwargs):
        """Send a :class:`Message` to another user.""" 
        msg = Message(isread=False, receiver=user, source='User', **kwargs) #sender_id=self.id,
        db.session.add(msg)
        db.session.commit()
        return msg

    @property
    def sent_messages(self):
        """Retrieve the messages sent by user."""
        return Message.query.filter(Message.sender_id==self.id).all()

    # tasks
    tasks = db.relationship('Task', backref='owner', lazy='dynamic')
    watched_tasks = db.relationship('Task', secondary=watched_tasks, backref=db.backref('watcher', lazy='dynamic'))
    """The :class:`Task` user watched."""

    def create_task(self, **kwargs):
        """Create a :class:`Task`."""
        t = Task(watcher=[self], **kwargs)
        t.owner = self
        db.session.add(t)
        db.session.commit()
        return t

    def watch_task(self, task):
        """Watch a :class:`Task`."""
        self.watched_tasks.append(task)
        db.session.add(self)
        db.session.commit()

    # comment
    answers = db.relationship('Answer', backref='owner', lazy='dynamic')
    comments = db.relationship('Comment', backref='owner', lazy='dynamic')
    designComments = db.relationship('DesignComment', backref='owner', lazy='dynamic')
    def answer_a_task(self, task, content):
        """Give an :class:`Answer` about a :class:`Task`.""" 
        a = Answer(content=content)
        a.task = task 
        a.owner = self
        db.session.add(a)
        db.session.commit()
        return a
    def comment_an_answer(self, answer, content):
        """Make a :class:`Comment` about an :class:`Answer`.""" 
        c = Comment(content=content)
        c.answer = answer 
        c.owner = self
        db.session.add(c)
        db.session.commit()
        return c

    def __repr__(self):
        return '<User[%d]: %r>' % (self.id, self.username)

    # email
    def send_email(self, subject, template, **kwargs):
        """Send an email."""
        _send_email(self.email, subject, template, **kwargs)

    # calendar
    memos = db.relationship('Memo', backref='owner', lazy='dynamic')
    """All :class:`Memo` belong to user."""
    # before how long should we notify user ( in minutes )
    memo_ahead = db.Column(db.Integer, default=60*6) # 6 hour ahead
    """How much time ahead to remind user about user's :class:`Memo`."""
    # whether we send an email to user
    memo_email = db.Column(db.Boolean, default=True)
    """Whether send email to remind the user."""

    def add_memo(self, **kwargs):#title, content, timescale):
        """Add a :class:`Memo` to calendar"""
        m = Memo(**kwargs)
        #title = title, content=content, timescale=timescale)
        self.memos.append(m)

        db.session.add(m)
        db.session.add(self)
        db.session.commit()
        return m

    def check_memo(self):
        """Check whether some :class:`Memo` is about to happen.
        Send a :class:`Message` or an email to remind those will 
        happen in :attr:`memo_ahead`."""
        td = timedelta(minutes=self.memo_ahead)
        for m in self.memos:
            if m.message_sent == True: continue
            if (datetime.now()+td > m.plan_time):
                # send via administrator
                User.query.get(1).send_message_to(self, title='Notice: [%s]' % m.title, 
                    content='Memo: [%s] is about to happen.' % m.title)

                # send email if needed
                if self.memo_email == True:
                #    self.send_email('Notice: [%s]' % m.title, 'email/memo', memo=m, user=self)
                    print m.id, m.title, 'sent email'

                m.message_sent = True
                db.session.add(m)
        db.session.commit()

    def get_memos_during(self, start_time, end_time):
        """Get :class:`Memo` in a specific duration."""
        return self.memos.filter(start_time < Memo.plan_time, Memo.plan_time < end_time).all()

    # track
    tracks = db.relationship('Track', secondary=tracks, backref=db.backref('user', lazy='dynamic')) 
    """The :class:`Track` the user belong to."""

    # favoriate design 
    favorite_designs = db.relationship('Design', secondary=Favorite_design, backref=db.backref('user', lazy='dynamic'))
    """User's favorite :class:`Design`."""
    designs = db.relationship('Design', backref='owner', lazy='dynamic')
    """User's :class:`Design`."""





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
    """wrapper for ``flask.ext.login``"""
    return User.query.get(int(user_id))




from flask.ext.login import AnonymousUserMixin

class AnonymousUser(AnonymousUserMixin):
    """Anonymous user is required for ``flask.ext.login``.
    This kind of user has limited permissions."""
    pass 

login_manager.anonymous_user = AnonymousUser


