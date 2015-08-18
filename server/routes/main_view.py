# -*- coding: utf-8 -*-

from . import main

from flask import render_template, jsonify, request, current_app, url_for
from flask.ext.login import login_required

@main.before_app_request 
def before_request():
    # update user's last seen
    # update some cookies or xxx
    pass

#@login_required
@main.route('/')
def index():
    return render_template('index.html')

#@login_required
@main.route('/design')
def design():
    return render_template('design.html')



