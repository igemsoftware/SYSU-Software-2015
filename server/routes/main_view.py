# -*- coding: utf-8 -*-

from . import main

from flask import render_template, jsonify, request, current_app, url_for, jsonify, abort
from flask.ext.login import login_required
import json

@main.before_app_request 
def before_request():
    # update user's last seen
    # update some cookies or xxx
    pass

@main.route('/')
#@login_required
def index():
    return render_template('index.html')

@main.route('/design')
#@login_required
def design():
    return render_template('design.html')

@main.route('/experiment')
@login_required
def experiment():
    return render_template('experiment.html')


