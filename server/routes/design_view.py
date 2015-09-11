# -*- coding: utf-8 -*-

from . import design

from ..models import ComponentPrototype, ComponentInstance, Relationship
from ..models import Protocol, Device, Design
from flask import jsonify, request
from flask.ext.login import login_required, current_user
import json

def Device_check_and_update(device_id):
    d = Device.query.get(device_id)
    if not d:
        return jsonify(error='Work doesn\'t exist')
    d.update_from_db()
    return d

@design.route('/data/fetch/parts')
def data_fetch_parts():
    l = [] 
    for c in ComponentPrototype.query.order_by(ComponentPrototype.name.asc()).all():
        if c.id == 1: continue
        l.append({'name': c.name,
                  'introduction': c.introduction,
                  'source': c.source,
                  'risk': c.risk,
                  'type': c.type,
                  'BBa': c.BBa,
                  'bacterium': c.bacterium,
                  'attr': c.attr
                  })
    return jsonify(parts=l)

@design.route('/data/fetch/relationship')
def data_fetch_relationship():
    l = []
    for r in Relationship.query.all():
        l.append({'start': r.start.attr,
                  'end': r.end.attr,
                  'type': r.type,
                  'equation':r.equation.jsonify() #render()
                  })
    return jsonify(relationship=l)

@design.route('/data/fetch/adjmatrix')
def data_fetch_adjmatrix():
    l = {} 
    for c in ComponentPrototype.query.all():
        if c.id == 1: continue
        l[c.name] = list(set(map(lambda x: x.end.name, c.point_to.all()) + 
                             map(lambda x: x.start.name, c.be_point.all())
                            ))

    return jsonify(adjmatrix=l)

@design.route('/data/fetch/device')
def data_fetch_device():
    devices = [] 
    for device in Device.query.filter_by().all():
        device.update_from_db()
        devices.append({'name': device.name,
                  'parts': map(lambda x: x.jsonify(), device.parts),
                  'relationship': device.relationship,
                  'interfaceA': device.interfaceA,
                  'interfaceB': device.interfaceB,
                  'backbone': device.backbone,
                   'full_description': device.full_description,
                   'source': device.source,
                   'risk': device.risk,
                  })

    return jsonify(deviceList=devices)


@design.route('/<int:id>', methods=['GET'])
def get_design(id):
    c = Design.query.get(id)
    c.update_from_db()
    
    content = {
            'id': c.id,
            'parts': map(lambda x: x.jsonify(), c.parts),
            'name': c.name,
            'relationship': c.relationship,
            'interfaceA': c.interfaceA,
            'interfaceB': c.interfaceB,
            'full_description': c.full_description,
            'backbone': c.backbone,
            'source': c.source,
            'risk': c.risk,
            'plasmids': json.loads(c.plasmids),
            'img': c.img,
    }
    return jsonify(content=content)

@design.route('/<int:id>', methods=['POST'])
def store_design(id):
    if id < 0:
        c = Design()
        current_user.designs.append(c)
        c.commit_to_db()
    else:
        c = Design.query.get(id)
    
    data = request.get_json()

    c.update_from_db()
    for attr in ['parts', 'name', 'relationship',
            'interfaceA', 'interfaceB', 'full_description',
            'backbone', 'source', 'risk', 'plasmids',
            'img']:
        if not data.has_key(attr): continue

        if attr in ['plasmids']:
            c.__setattr__(attr, json.dumps(data[attr]))
        else:
            c.__setattr__(attr, data[attr])

    c.commit_to_db()

    return jsonify(id=c.id)

@design.route('/all', methods=['GET'])
@login_required
def get_all_designs():

    l = []
    for c in current_user.designs.all():
        c.update_from_db()
        
        l.append( {
                'id': c.id,
                'name': c.name,
                'full_description': c.full_description,
                'img': c.img,
        })
    return jsonify(designs=l)


