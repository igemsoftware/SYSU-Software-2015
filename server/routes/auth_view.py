from . import auth

from flask import flash, redirect, render_template, request, url_for
from flask.ext.login import current_user, login_user, logout_user, login_required

from ..models import User, Track
from ..forms.user_form import LoginForm, RegistrationForm
from .. import db

@auth.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm(request.form)
    form.tracks.choices = [(track.id, track.name) for track in Track.query.all()]

    if request.method == 'POST' and form.validate():
        u = User(username=form.username.data, email=form.email.data, password=form.password.data, avatar=form.avatar.data)
        for track_id in form.tracks.data:
            u.tracks.append(Track.query.get(track_id))
        db.session.add(u)
        db.session.commit()
        return 'success' #redirect(url_for('auth.login')) 
    else:
        return render_template('test/register.html', form=form, tracks=Track.query.all())


@auth.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm(request.form)
    if request.method == 'POST' and form.validate():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None:
            form.username.errors = True 
        elif not user.verify_password(form.password.data):
            form.password.errors = True 
        else:
            login_user(user)
            return redirect(request.args.get('next') or url_for('main.index'))
    return render_template('auth/login.html', form=form)

@login_required
@auth.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('main.index'))

