from threading import Thread
from flask import current_app, render_template
from flask.ext.mail import Message
from .. import mail

def __send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)

def _send_email(to, subject, template, async=True, **kwargs):
    app = current_app._get_current_object()
    msg = Message(app.config['FLASKY_MAIL_SUBJECT_PREFIX'] + ' ' + subject,
                  sender=app.config['FLASKY_MAIL_SENDER'], recipients=[to])
    msg.body = render_template(template + '.txt', **kwargs)
    msg.html = render_template(template + '.html', **kwargs)
    try:
        if async:
            thr = Thread(target=__send_async_email, args=[app, msg])
            thr.start()
            return thr
        else:
            with app.app_context():
                mail.send(msg)
    except:
        print 'Sending email failed'
        pass


def _send_raw_email(to, subject, body):
    app = current_app._get_current_object()
    msg = Message(app.config['FLASKY_MAIL_SUBJECT_PREFIX'] + ' ' + subject,
                  sender=app.config['FLASKY_MAIL_SENDER'], recipients=[to])
    msg.body = body 
    thr = Thread(target=__send_async_email, args=[app, msg])
    thr.start()
    return thr

