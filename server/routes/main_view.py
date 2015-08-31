# -*- coding: utf-8 -*-

from . import main
from ..models import Circuit, Protocol

from flask import render_template, jsonify, request, current_app, url_for, jsonify, abort
from flask.ext.login import login_required
import json

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




@login_required
@main.route('/experiment')
def experiment():
    return render_template('experiment.html')

@login_required
@main.route('/circuit/<int:id>')
def circuit(id): 
    # skip: check whether current user has the privilege 
    
    c = Circuit.query.get(id)
    if not c:
        abort(404)

    return jsonify(
            title = c.title,
            protocol = json.loads(c.protocol),
            )

@main.route('/protocol')
def protocol():
    protocols = []
    for p in Protocol.query.filter_by(recommend=True).all():
        protocols.append(
                {
                    'name': p.name,
                    'introduction': p.introduction,
                    'component': p.component,
                    'procedure' : p.procedure,
                    'likes': p.likes,
                });

    return jsonify(protocols=protocols)

         
