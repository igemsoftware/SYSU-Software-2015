# -*- coding: utf-8 -*-

from . import auth

from flask import flash, redirect, render_template, request, url_for
from flask.ext.login import current_user, login_user, logout_user, login_required

from ..models import User, Track
from ..forms.user_form import LoginForm, RegistrationForm
from .. import db

@auth.route('/register', methods=['GET', 'POST'])
def register():
    """
        :Usage: The page where you can register. For the security issue, we strongly recommend that you should use our webpage to register instead of sending POST request directly.
        :Data Format: Contains username, email, password, tracks' number and avatar url. 
    """
    form = RegistrationForm(request.form)
    form.tracks.choices = [(track.id, track.name) for track in Track.query.all()]

    # print form.avatar.data

    if request.method == 'POST' and form.validate():
        u = User(username=form.username.data, email=form.email.data, password=form.password.data, avatar=form.avatar.data)
        for track_id in form.tracks.data:
            t = Track.query.get(track_id)
            if t: u.tracks.append(t)
        db.session.add(u)
        db.session.commit()
        return redirect(url_for('auth.login')) 
    else:
        return render_template('auth/register.html', form=form, tracks=Track.query.all())

@auth.route('/login', methods=['GET', 'POST'])
def login():
    """
        :Usage: The page where you can login. For the security issue, we strongly recommend that you should use our webpage to login instead of sending POST request directly.
        :Data Format: Contains username and password. 
    """
    if not current_user.is_anonymous():
        return redirect(request.args.get('next') or url_for('person.index'))
    form = LoginForm(request.form)
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if not user:
            form.username.errors = ['The username does not exist.']
            return render_template('auth/login.html', form=form)
        elif not user.verify_password(form.data.get('password', '')): 
            form.password.errors = ['Error password.']
            return render_template('auth/login.html', form=form)
        login_user(user)
        user.check_memo()
        user.ping()
        return redirect(request.args.get('next') or url_for('person.index'))
    print form.errors
    return render_template('auth/login.html', form=form)

@auth.route('/logout')
@login_required
def logout():
    """
        :Note: Login required.
        :Usage: Access this route can logout your accout.
        :Data: None 
    """
    logout_user()
    return redirect(url_for('main.index'))

