# -*- coding: utf-8 -*-

from . import design

from ..models import ComponentPrototype, ComponentInstance, Relationship
from ..models import Protocol, Device, Circuit 
from flask import jsonify, request
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
    for c in ComponentPrototype.query.all():
        if c.id == 1: continue
        l.append( {'name': c.name,
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
        devices.append({'title': device.title,
                  'parts': map(lambda x: x.jsonify(), device.parts),
                  'relationship': device.relationship,
                  'interfaceA': device.interfaceA,
                  'interfaceB': device.interfaceB,
                   'introduction': device.introduction,
                   'source': device.source,
                   'risk': device.risk,
                  })

    return jsonify(deviceList=devices)


@design.route('/circuit/<int:id>', methods=['GET'])
def get_circuit(id):
    c = Circuit.query.get(id)
    if not c: return 'failed.' 
    return jsonify(content = c.content)

@design.route('/circuit/<int:id>', methods=['POST'])
def store_circuit(id):
    c = Circuit.query.get(id)
    if not c: return 'failed.' 

    content = request.form.get('content', '')
    c.content = content

    return 'Success'
