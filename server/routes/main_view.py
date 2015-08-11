from . import main

from flask import render_template, jsonify, request, current_app
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


from ..models import Work, ComponentPrototype, ComponentInstance, Relationship
from flask import jsonify

def work_check_and_update(work_id):
    w = Work.query.get(work_id)
    if not w:
        return jsonify(error='Work doesn\'t exist')
    w.update_from_db()
    return w

@main.route('/data/fetch/parts')
def data_fetch_parts():
    l = {} 
    for c in ComponentPrototype.query.all():
        if c.id == 1: continue
        l[c.name] = c.type
    return jsonify(parts=l)

@main.route('/data/fetch/relationship')
def data_fetch_relationship():
    l = []
    for r in Relationship.query.all():
        l.append({'start': r.start.name,
                  'end': r.end.name,
                  'type': r.type})
    return jsonify(relationship=l)

@main.route('/data/fetch/adjmatrix')
def data_fetch_adjmatrix():
    l = {} 
    for c in ComponentPrototype.query.all():
        if c.id == 1: continue
        l[c.name] = list(set(map(lambda x: x.end.name, c.point_to.all()) + 
                             map(lambda x: x.start.name, c.be_point.all())
                            ))

    return jsonify(adjmatrix=l)

@main.route('/data/fetch/device')
def data_fetch_device():
    devices = [] 
    for w in Work.query.filter_by(type='device').all():
        w.update_from_db()
        devices.append({'title': w.title,
                  'parts': map(lambda x: x.jsonify(), w.parts),
                  'relationship': w.relationship,
                  'interfaceA': w.interfaceA,
                  'interfaceB': w.interfaceB
                  })

    return jsonify(deviceList=devices)



