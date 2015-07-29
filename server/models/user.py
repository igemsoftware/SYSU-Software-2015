from .. import db
from .. import login_manager

from message import Message
from task import watched_tasks, Task

from datetime import datetime
from flask.ext.login import UserMixin

from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
import random, string


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

    # functional
    recv_messages = db.relationship('Message', backref='receiver', lazy='dynamic')
    @property
    def sent_messages(self):
        return Message.query.filter(Message.sender_id==self.id).all()
    watched_tasks = db.relationship('Task', secondary=watched_tasks, backref=db.backref('watcher', lazy='dynamic'))




    def __init__(self, **kwargs):
        kwargs['username'] = kwargs['username'][:128]
        super(User, self).__init__(**kwargs)

    def ping(self, ip):
        last_seen = datetime.now()
        db.session.add(self)

    @property
    def password(self):
        return "You should not see it"

    @password.setter
    def password(self, value):
        self.salt = ''.join([random.choice(string.ascii_letters + string.digits) for n in xrange(32)])
        self.password_hash = generate_password_hash(value+self.salt)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password+self.salt)

    # functional
    def send_message_to(self, title, content, user):
        msg = Message(type=0, isread=False, sender_id=self.id, receiver_id=user.id, content=content, title=title)
        db.session.add(msg)
        db.session.commit()
        return msg

    def create_task(self, title, abstract, content):
        t = Task(title=title, abstract=abstract, content=content, watcher=[self], sender_id=self.id)
        db.session.add(t)
        db.session.commit()
        return t

    def watch_task(self, task_id):
        self.watched_tasks.append(Task.query.get(task_id))
        db.session.add(self)
        db.session.commit()


    def __repr__(self):
        return '<User[%d]: %r>' % (self.id, self.username)


    # confirmed
#    confirmed = db.Column(db.Boolean, default=False)
    #confirm_token = db.Column(db.String(128))

    # confirmation
    def generate_confirmation_token(self, expiration=3600):
        s = Serializer(current_app.config['SECRET_KEY'], expiration, salt=self.salt)
        return s.dumps({'confirm':self.id})

    def confirm(self,token):
        s = Serializer(current_app.config['SECRET_KEY'], salt=self.salt)
        try:
            data = s.loads(token)
        except:
            return False
        if data.get('confirm') != self.id:
            return False
        self.confirmed = True
        db.session.add(self)
        return True

    def send_confirmation(self):
        self.confirmed = False
        token = self.generate_confirmation_token()
# not complete
        send_email(self.email, 'please comfirm your email.',
                    'auth/email/confirm', user=self, token=token)
        flash('Comfirmation email has been sent.')


    # change email 
    def generate_email_change_token(self, new_email, expiration=3600):
        s = Serializer(current_app.config['SECRET_KEY'], expiration)
        return s.dumps({'change_email': self.id, 'new_email': new_email})

    def change_email(self, token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except:
            return False
        if data.get('change_email') != self.id:
            return False
        new_email = data.get('new_email')
        if new_email is None:
            return False
        self.confirmed = True
        #self.email = new_email
        db.session.add(self)
        return True
    def send_change_email(self, new_email):
        token = self.generate_email_change_token(new_email)
        send_email(new_email, 'Please comfirm your email.',
                    'auth/email/change_email', user=self, token=token)
        flash('Comfirmation email has been sent.')


    # reset password
    def generate_reset_token(self, expiration=3600):
        s = Serializer(current_app.config['SECRET_KEY'], expiration, salt=self.salt)
        return s.dumps({'reset':self.id})
    def reset_password(self, token, new_password):
        s = Serializer(current_app.config['SECRET_KEY'], salt=self.salt)
        try:
            data = s.loads(token)
        except:
            return False
        if data.get('reset') != self.id:
            return False
        self.password = new_password
        db.session.add(self)
        return True
    def send_reset_email(self):
        token = self.generate_reset_token()
        send_email(self.email, 'reset the password',
                   'auth/email/reset_password', user=self, token=token)
        flash('Reset comfirm email has been sent')


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


