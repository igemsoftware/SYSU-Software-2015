# -*- coding: utf-8 -*-

from . import design
from .. import db

from ..models import ComponentPrototype, ComponentInstance, Relationship
from ..models import Protocol, Device, Design, EquationBase
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
    """
        :Usage: Get all parts information.
        :Output: A list of parts.
        :Output Example: 

        .. code-block:: json

            {
              "parts": [
                {
                  "BBa": "BBa_B0032",
                  "attr": "RBS:BBa_B0032",
                  "bacterium": "",
                  "introduction": "No introduction yet.",
                  "name": "RBS",
                  "risk": -1,
                  "source": "Come from no where.",
                  "type": "RBS"
                },
                {
                  "BBa": "",
                  "attr": "OHHL",
                  "bacterium": "",
                  "introduction": "No introduction yet.",
                  "name": "OHHL",
                  "risk": -1,
                  "source": "Come from no where.",
                  "type": "chemical"
                }]
            }



    """
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
    """
        :Usage: Get all relationship information.
        :Output: A list of relationship.
        :Output Example: 

        .. code-block:: json

            {
              "relationship": [
                {
                  "end": "gfp:BBa_E0040",
                  "equation": {
                    "content": "\\frac{ d([Pcl]) }{ dt } = {{alpha}} * [Pcl] + {{beta}}",
                    "parameters": {
                      "alpha": 0.1,
                      "beta": "K_1"
                    }
                  },
                  "start": "Ptet:BBa_R0040",
                  "type": "normal"
                },
                {
                  "end": "Ptet:BBa_R0040",
                  "equation": {
                    "content": "",
                    "parameters": {}
                  },
                  "start": "gfp:BBa_E0040",
                  "type": "normal"
                }]
            }


    """
    l = []
    for r in Relationship.query.all():
        l.append({'start': r.start.attr,
                  'end': r.end.attr,
                  'type': r.type,
                  })
    return jsonify(relationship=l)

@design.route('/data/fetch/adjmatrix')
def data_fetch_adjmatrix():
    """
        :Usage: Get adjacent matrix of all components.
        :Output: An adjacent matrix.
        :Output Example: 

        .. code-block:: json

            {
             "adjmatrix": {
                "2UVRB-TetRDBD": [
                  "UVR8-TetRDBD(dimer)",
                  "PABA"
                ],
                "3OC12HSL": [
                  "LasI",
                  "Ptet"
                ],
                "A-RBS": [
                  "Pcon",
                  "cI",
                  "luxI"
                ]
            }
    """
    l = {} 
    for c in ComponentPrototype.query.all():
        if c.id == 1: continue
        l[c.name] = list(set(map(lambda x: x.end.name, c.point_to.all()) + 
                             map(lambda x: x.start.name, c.be_point.all())
                            ))

    return jsonify(adjmatrix=l)

@design.route('/data/fetch/device')
def data_fetch_device():
    """
        :Usage: Get all devices. 
        :Output: A list of devices.
        :Output Example: 

        .. code-block:: json

            {
                "deviceList": [
                {
                  "interfaceA": "Fusaric Acid_1",
                  "interfaceB": "FadP_1",
                  "introduction": "protects banana plants from Fusarium oxysporum. The Banana Guard system senses fusaric acid and, in response, produces fungal growth inhibitors to prevent infection of the banana plant. In addition we have also implemented a Kill-switch that disables our system when fusaric acid is not present. For this, we have optimized the circuit design, assessed the potential of BananaGuard in the soil, and analyzed the robustness of the system using different mathematical models.",
                  "parts": [
                    {
                      "partID": "Fusaric Acid_1",
                      "partName": "Fusaric Acid",
                      "positionX": 300.0,
                      "positionY": 300.0
                    },
                    {
                      "partID": "FadP_1",
                      "partName": "FadP",
                      "positionX": 300.0,
                      "positionY": 300.0
                    },
                    {
                      "partID": "fadP_1",
                      "partName": "fadP",
                      "positionX": 300.0,
                      "positionY": 300.0
                    }
                  ],
                  "relationship": [
                    {
                      "end": "FadP_1",
                      "start": "Fusaric Acid_1",
                      "type": "inhibition"
                    },
                    {
                      "end": "FadP_1",
                      "start": "fadP_1",
                      "type": "promotion"
                    }
                  ],
                  "risk": -1,
                  "source": "http://2014.igem.org/Team:Wageningen_UR/project/fungal_sensing",
                  "title": "Sensor"
                }]
            }

    """
    devices = [] 
    for device in Device.query.filter_by().all():
        device.update_from_db()
        if (device.name == 'Sunlight responsor system 2015SYSU-Software'): continue
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

@design.route('/data/fetch/system')
def data_fetch_system():
    """
        :Usage: Get all systems. 
        :Output: A list of systems.
        :Output Example: 

        .. code-block:: json

            {
                "deviceList": [
                {
                  "interfaceA": "Fusaric Acid_1",
                  "interfaceB": "FadP_1",
                  "introduction": "protects banana plants from Fusarium oxysporum. The Banana Guard system senses fusaric acid and, in response, produces fungal growth inhibitors to prevent infection of the banana plant. In addition we have also implemented a Kill-switch that disables our system when fusaric acid is not present. For this, we have optimized the circuit design, assessed the potential of BananaGuard in the soil, and analyzed the robustness of the system using different mathematical models.",
                  "parts": [
                    {
                      "partID": "Fusaric Acid_1",
                      "partName": "Fusaric Acid",
                      "positionX": 300.0,
                      "positionY": 300.0
                    },
                    {
                      "partID": "FadP_1",
                      "partName": "FadP",
                      "positionX": 300.0,
                      "positionY": 300.0
                    },
                    {
                      "partID": "fadP_1",
                      "partName": "fadP",
                      "positionX": 300.0,
                      "positionY": 300.0
                    }
                  ],
                  "relationship": [
                    {
                      "end": "FadP_1",
                      "start": "Fusaric Acid_1",
                      "type": "inhibition"
                    },
                    {
                      "end": "FadP_1",
                      "start": "fadP_1",
                      "type": "promotion"
                    }
                  ],
                  "risk": -1,
                  "source": "http://2014.igem.org/Team:Wageningen_UR/project/fungal_sensing",
                  "title": "Sensor"
                }]
            }

    """
    systems = [] 
    for system in Device.query.filter_by().all():
        system.update_from_db()
        if (system.name == 'Sunlight responsor system 2015SYSU-Software'):
	        systems.append({'name': system.name,
	                  'parts': map(lambda x: x.jsonify(), system.parts),
	                  'relationship': system.relationship,
	                  'interfaceA': system.interfaceA,
	                  'interfaceB': system.interfaceB,
	                  'backbone': system.backbone,
	                   'full_description': system.full_description,
	                   'source': system.source,
	                   'risk': system.risk,
	                  })

    return jsonify(systemList=systems)

@design.route('/data/<int:id>', methods=['GET'])
def get_design(id):
    """
        :Method: GET 
        :Usage: Fetch a design. 
        :Input: A json object of design.
        :Onput Example: The same as an item of the output of :http:get:`/design/data/fetch/device` .
    """
    if current_user.is_anonymous():
        return jsonify(error=1, aux=url_for(login_manager.login_view, next=url_for('bank.index')) )

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

@design.route('/data', methods=['POST'])
def store_design():
    """
        :Method: POST
        :Usage: Update a design. 
        :Input: A json object of design.
        :Input Example: The same as an item of the output of :http:get:`/design/data/fetch/device` .
    """

    data = request.get_json()
    id = data['id']
    if id < 0:
        c = Design()
        c.owner = current_user
        c.commit_to_db()
    else:
        c = Design.query.get(id)
    c.owner = current_user

    c.update_from_db()
    for attr in ['parts', 'name', 'relationship',
            'interfaceA', 'interfaceB', 'full_description',
            'backbone', 'references', 'risk', 'plasmids',
            'img']:
        if not data.has_key(attr): continue

        if attr in ['plasmids']:
            c.__setattr__(attr, json.dumps(data[attr]))
        else:
            c.__setattr__(attr, data[attr])

    c.commit_to_db()

    return jsonify(id=c.id)



# get designs from different sources

@design.route('/all', methods=['GET'])
@login_required
def get_all_designs():
    """
        :Note: Login required
        :Usage: Fetch all the user's design.
        :Output Example: The same as an item of the output of :http:get:`/design/data/fetch/device` .
    """
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

@design.route('/public', methods=['GET'])
@login_required
def get_public_designs():
    """
        :Note: Login required
        :Usage: Fetch all public designs. 
        :Output Example: The same as an item of the output of :http:get:`/design/data/fetch/device` .
    """
    l = []
    for c in Design.query.filter_by(is_public=True).all():
        c.update_from_db()
        
        l.append( {
                'id': c.id,
                'name': c.name,
                'full_description': c.full_description,
                'img': c.img,
        })
    return jsonify(designs=l)

@design.route('/favorite', methods=['GET'])
@login_required
def get_favorite_designs():
    """
        :Note: Login required
        :Usage: Fetch all user's favorite designs. 
        :Output Example: The same as an item of the output of :http:get:`/design/data/fetch/device` .
    """

    l = []
    for c in current_user.favorite_designs:
        c.update_from_db()
        
        l.append( {
                'id': c.id,
                'name': c.name,
                'full_description': c.full_description,
                'img': c.img,
        })
    return jsonify(designs=l)

@design.route('/mark/<int:id>', methods=['POST'])
@login_required
def mark_design(id):
    """
        :Note: Login required
        :Content-type: application/json
        :Usage: Mark design with 7 numbers 
    """
    d = Design.query.get(id)
    if not d: abort(404)

    data = request.get_json()

    count = d.eval_count
    d.eval_compatibility = ((float(d.eval_compatibility)*count)+data[0])/(count+1)
    d.eval_safety        = ((float(d.eval_safety       )*count)+data[1])/(count+1)
    d.eval_demand        = ((float(d.eval_demand       )*count)+data[2])/(count+1)
    d.eval_completeness  = ((float(d.eval_completeness )*count)+data[3])/(count+1)
    d.eval_efficiency    = ((float(d.eval_efficiency   )*count)+data[4])/(count+1)
    d.eval_reliability   = ((float(d.eval_reliability  )*count)+data[5])/(count+1)
    d.eval_accessibility = ((float(d.eval_accessibility)*count)+data[6])/(count+1)
    d.eval_count += 1 

    db.session.add(d)
    db.session.commit()

    d.check_public()

    return get_design_mark(id)

@design.route('/mark/<int:id>', methods=['GET'])
def get_design_mark(id):
    """
        :Usage: Get the mark of a design 
    """
    d = Design.query.get(id)
    if not d: return jsonify(eval=[0]*7) 

    def s(f):
        return '%g' % f

    data = [0] * 7
    data[0] = s(d.eval_compatibility)
    data[1] = s(d.eval_safety)
    data[2] = s(d.eval_demand)
    data[3] = s(d.eval_completeness)
    data[4] = s(d.eval_efficiency)
    data[5] = s(d.eval_reliability)
    data[6] = s(d.eval_accessibility)

    return jsonify(eval=data) 


@design.route('/equation', methods=['POST'])
@login_required
def add_an_equation():
    """
        :Note: Login required
        :Usage: Add an equation. 
        :Input Example: 

        .. code-block:: json

            {
                "id": -1
                "target": "A-RBS",
                "requirement": ["3OC12HSL", "A-RBS", "ADC", "AHL"],
                "coeffList": [
                                { "alpha": 12.34 },
                                { "dna": 2.03 },
                                { "u1": 12.8 }
                             ],
                "formular": "{{alpha}} * {{dna}} / (1 + (UVB) ** k) - {{u1}} * UVR_TetR"
            }
    """

    data = request.get_json()
    id = data.get('id', -1)
    if id <= 0:
        e = EquationBase()
    else:
        e = EquationBase.query.get(id)
        e.update_from_db()

    e.target = data.get('target', '')
    e.related = list(data.get('requirement', []))
    e.parameter = dict(map(lambda x: x.items()[0] if x else [], data.get('coeffList', [])))
    e.formular = data.get('formular', '')
    
    e.commit_to_db()
    return 'success'


@design.route('/equation/search', methods=['POST'])
#@login_required
def get_equations():
    """
        :Note: Login required
        :Usage: Get equations for a given components list.
        :Input Example: 

        .. code-block:: json

            {
                "related": ["YFP", "yfp"]
            }
    """

    data = request.get_json()
    related = set(data.get('related', []))
    equations = []
    for e in EquationBase.query.all():
        e.update_from_db()
        needed = set(e.all_related)
        if related >= needed:
            equations.append(
            {
                "id": e.id,
                "target": e.target, 
                "requirement": e.related,
                "coeffList": [{coname: value} for coname,value in e.parameter.iteritems()],
                "formular": e.formular 
            })
    return jsonify(equations=equations)



