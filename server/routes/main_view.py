# -*- coding: utf-8 -*-

from . import main
from ..models import Design
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
    """
        :Usage: The index
    """
    return render_template('index.html')

@main.route('/design')
@login_required
def design():
    """
        :Note: Login required
        :Usage: The redesign tools. 
    """

    return render_template('design.html')

@main.route('/experiment')
@login_required
def experiment():
    """
        :Note: Login required
        :Usage: The modeling tools. 
    """
    return render_template('experiment.html')

@main.route('/embedded/<int:id>')
def embedded(id):
    """
        :Usage: Get a design.
    """
    c = Design.query.get(id)
    return render_template('embedded.html', circuit=c)

