# -*- coding: utf-8 -*-

from . import protocol 
from .. import db
from ..models import Protocol, Circuit
from flask import jsonify, json, request
from flask.ext.login import login_required

@protocol.route('/setB')
def all_protocols():
    protocols = map(lambda x: x.jsonify(), Protocol.query.filter_by(recommend=True, setB=True).all())
    return jsonify(protocols=protocols)

@protocol.route('/circuit/<int:id>', methods=['GET'])
@login_required
def get_circuit_s_protocols(id): 
    # skip: check whether current user has the privilege 
    c = Circuit.query.get(id)
    if not c: abort(404)

    return jsonify(protocols = json.loads(c.protocols))


@protocol.route('/circuit/<int:id>', methods=['POST'])
@login_required
def set_circuit_s_protocols(id): 
#    require checking current user
#    if request.headers['Content-Type'] == 'application/json':
    protocols = request.get_json(force=True)

    c = Circuit.query.get(id)
    if not c: abort(404)

    for ind, p in enumerate(protocols):
        p['id'] = ind+1
    c.protocols = json.dumps(protocols)
    db.session.add(c)

    return 'Success' 

