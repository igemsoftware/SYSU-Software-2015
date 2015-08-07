from . import main

from flask import render_template, jsonify, request, current_app
from flask.ext.login import login_required

@login_required
@main.route('/')
def index():
    return render_template('index.html')

@login_required
@main.route('/design')
def design():
    return render_template('design.html')
