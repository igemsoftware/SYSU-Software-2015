from . import auth

from flask import flash, redirect
from flask.ext.login import current_user, login_user, logout_user, login_required

@auth.route('/register')
def register():
    return ''

@login_required
@auth.route('/login')
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user is not None and user.verify_password(form.password.data):
            login_user(user)
            return redirect(request.args.get('next') or url_for('main.index'))
        flash('Invalid username or password.')
    return render_template('auth/login.html', form=form)

@login_required
@auth.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('main.index'))

