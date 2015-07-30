from flask import current_app
from flask.ext.wtf import Form
from flask.ext.login import current_user

from wtforms import StringField, PasswordField, BooleanField,\
        SubmitField, TextAreaField, IntegerField, RadioField, SelectField
from wtforms.validators import Required, Length, Email, Regexp, EqualTo, NumberRange
from wtforms import ValidationError

from ..models import User 

class LoginFormWithUsername(Form):
    username = StringField('Username', validators=[Required('Please input your username'), Length(0, 128)])
    password = PasswordField('Password', validators=[Required('Please input your password.'), Length(0, 32)])
    #remember_me = BooleanField('Keep me logged in')
    submit = SubmitField('Login')

    def validate_username(self, field):
        u = User.query.filter_by(username=field.data).first()
        if not u:
            raise ValidationError('The user doesn\'t exist.')


class LoginForm(Form):
    email = StringField('Email', validators=[Required('Please input your email.'), Length(1, 64),
                                             Email('Please input a valid email.')])
    password = PasswordField('Password', validators=[Required('Please input your password.')])
    #remember_me = BooleanField('Keep me logged in')
    submit = SubmitField('Login')

    def validate_email(self, field):
        u = User.query.filter_by(email=field.data).first()
        if not u:
            raise ValidationError('The email does\'t exist.')

class UE_ChangeForm(Form):
    username = StringField('Username', validators=[Required('Cannot be empty.'), Length(1, 128, 'Over length')])
    email = StringField('Email', validators=[Required('Cannot be empty.'), Length(1, 128, 'Over length'),
                                             Email('Please input a valid email.')])
    submit = SubmitField('Save')

    def validate_email(self, field):
        u = User.query.filter_by(email=field.data).first()
        if u and u != current_user:
            raise ValidationError('The email is existing.')

    def validate_username(self, field):
        u = User.query.filter_by(username=field.data).first()
        if u and u != current_user:
            raise ValidationError('The username is existing.')

class RegistrationForm(Form):
    email = StringField('Email', validators=[Required('Cannot be empty.'), Length(1, 64),
                                           Email('Please input a valid email.')])
    username = StringField('Username', validators=[
        Required('Cannot be empty'), Length(1, 64)])#, Regexp('^[A-Za-z][A-Za-z0-9_.]*$', 0,
                                   #        'Usernames must have only letters, '
                                   #        'numbers, dots or underscores')])
    password = PasswordField('Password', validators=[
        Required('Cannot be emtpy.'), EqualTo('password2', message='Doesn\'t match,')])
    password2 = PasswordField('Reenter password', validators=[Required('Cannot be empty.')])
    submit = SubmitField('Register')

    def validate_email(self, field):
        u = User.query.filter_by(email=field.data).first()
        if u and u != current_user:
            raise ValidationError('The email is existing.')

    def validate_username(self, field):
        u = User.query.filter_by(username=field.data).first()
        if u and u != current_user:
            raise ValidationError('The username is existing.')



class ChangePasswordForm(Form):
    old_password = PasswordField('Old password', validators=[Required('Cannot be empty.')])
    password = PasswordField('New password', validators=[
        Required('Cannot be empty'), EqualTo('password2', message='Doesn\'t match')])
    password2 = PasswordField('Reenter new password', validators=[Required('Cannot be empty.')])
    submit = SubmitField('Save')


class PasswordResetForm(Form):
    email = StringField('Email', validators=[Required('Cannot be empty'), Length(1, 64),
                                             Email('Invalid email')])
    password = PasswordField('New password', validators=[
        Required('Cannot be emtpy.'), EqualTo('password2', message='donesn\'t match')])
    password2 = PasswordField('Confirm new password', validators=[Required('Cannot be empty')])
    submit = SubmitField('Save')

    def validate_email(self, field):
        u = User.query.filter_by(email=field.data).first()
        if u == None:
            raise ValidationError('The email doesn\'t exist')


class PasswordResetRequestForm(Form):
    email = StringField('Email', validators=[Required('Cannot be empty'), Length(1, 64),
                                             Email('Invalid email')])
    submit = SubmitField('Resent')

    def validate_email(self, field):
        u = User.query.filter_by(email=field.data).first()
        if u == None:
            raise ValidationError('The email doesn\'t exist')


