# -*- coding: utf-8 -*-

import traceback
from . import modeling 
from flask import render_template, jsonify, request
from ..tools.simulation.release import getModel, simulate, __example_system, name_handler
from ..models import EquationBase, Design, ComponentPrototype

# /modeling/
@modeling.route('/')
def modeling_index():
    """
        :Usage: Index of modeling.
    """
    return render_template('modeling.html')

@modeling.route('/design/all')
def design_all():
    """
        :Usage: Get all designs in a list.
        :Output: A list of design with brief description.
        :Example Output:

        .. code-block:: json

            {
              "designs": [
                {
                  "id": 1,
                  "img": "",
                  "title": "My first design"
                },
                {
                  "id": 2,
                  "img": "",
                  "title": "My second design"
                }]
            }
    """


    l = []
    for d in Design.query.all():
        l.append({'name': d.name,
                  'id': d.id,
                  'img': d.img})
    return jsonify(designs=l)
 

def get_system_from_related(design_set):
    try:
        design_set = set(design_set)

        # single source 
        #system = []
        #system_set = set({})

        # mutli-sourcing 
        system = []

        for target in design_set:
            component_set = set([])
            component_equ = []

            for e in EquationBase.query.filter_by(target=target).order_by(EquationBase.related_count.desc()).all():
#                print 'checking %s' % e.packed()
                e.update_from_db()
                related = set(e.related)
                if not related:
                    # empty requirment will be added if and only if current equation set is empty
                    if not component_set:
                        component_equ.append(e.packed())
                    else:
                        pass
                else:
                    if related <= component_set:
                        # ignore the included equations
                        pass
                    else:
                        component_set.update(related)
                        component_equ.append(e.packed())
#           from pprint import pprint
#           pprint(component_set)
#           pprint(component_equ)

            if len(component_equ) == 0:
                continue
            elif len(component_equ) == 1:
                system.append(component_equ[0])
            else:
                # concatenate all equation
                coedict = {}
                for ind, equ in enumerate(component_equ):
                    for coe, value in equ[2].iteritems():
                        newcoe = '%s_%d' % (coe, ind+1)
                        equ[3] = equ[3].replace('{{%s}}'%coe, '{{%s}}'%newcoe)
                        coedict.update({newcoe:value})

                system.append([target, list(component_set), coedict, '+'.join(map(lambda x: x[3], component_equ))])
#       from pprint import pprint
#       pprint(system)
        return system
    except:
        return []

def get_system_from_design(id):
    try:
        d = Design.query.get(id)
        d.update_from_db()
        vars = [ele['partAttr'] for ele in d.parts]
        newvars = map(lambda x: name_handler(x), vars) 
        var_mapper = {}
        for var, newvar in zip(vars, newvars):
            if var != newvar:
                var_mapper.update({newvar:var})
        design_set = set(newvars)

        system = get_system_from_related(design_set)
        if system==None: raise Exception
            
        return system, var_mapper
    except:
        return None, None

def get_initval_from_system(system, var_mapper):
    initval = []
    for ele in system:
        target = ele[0]
        if target in var_mapper: target = var_mapper[target]
        c = ComponentPrototype.query.filter_by(attr=target).first()
        initval.append(c.initval if c else 0.0)
    return initval

@modeling.route('/design/<int:id>', methods=["GET"])
def plot_design(id):
    """
        :Method: GET
        :Usage: Get the modeling result of a design. 
        :Output: A list of modeling result.
        :Example Output:

        .. code-block:: json

            {
              "title": "My third design",
              "variables": [
                {
                  "data": [
                    0.0,
                    4.740816042818218,
                    6.484951836812181,
                    7.126583619793085,
                    7.362627413956555,
                    7.449463311203071,
                    7.48140853986265,
                    7.493160565379463,
                    7.497483905660896,
                    7.499074378079328,
                    7.499659481791603,
                    7.499874730006023,
                    7.499953915618944,
                    7.499983046456802,
                    7.499993763102405,
                    7.499997705527904,
                    7.499999155888888,
                    7.499999689458825,
                    7.49999988573941,
                    7.499999957913747,
                    7.499999984518422,
                    7.49999999429717,
                    7.499999997897832,
                    7.4999999992292015,
                    7.499999999714647,
                    7.4999999998939755,
                    7.499999999961802,
                    7.4999999999929114,
                    7.49999999999535,
                    7.499999999984799,
                    7.499999999978797,
                    7.499999999985151,
                    7.499999999990436,
                    7.499999999992388,
                    7.49999999998935,
                    7.499999999982884,
                    7.4999999999815214,
                    7.499999999984339,
                    7.499999999991757,
                    7.4999999999963585,
                    7.499999999998405,
                    7.499999999997593,
                    7.500000000002704,
                    7.500000000001972,
                    7.50000000000245,
                    7.500000000005914,
                    7.500000000004918,
                    7.500000000001133,
                    7.500000000000818,
                    7.500000000001356,
                    7.499999999997104,
                    7.499999999997733,
                    7.499999999998741,
                    7.499999999998308,
                    7.499999999999561,
                    7.500000000000749,
                    7.499999999999774,
                    7.49999999999957,
                    7.50000000000084,
                    7.50000000000035,
                    7.499999999998851
                  ],
                  "name": "YFP"
                },
                {
                  "data": [
                    0.0,
                    0.29026753719071524,
                    0.10678357642142437,
                    0.0392835906919666,
                    0.01445166502710962,
                    0.005316485036105946,
                    0.0019558309412937274,
                    0.0007195119561872049,
                    0.000264694387814459,
                    9.73758908130971e-05,
                    3.58226864987252e-05,
                    1.3178466264801032e-05,
                    4.848100026096684e-06,
                    1.7835212568766812e-06,
                    6.561247586354478e-07,
                    2.4137961661090165e-07,
                    8.880091282228497e-08,
                    3.2669087592678784e-08,
                    1.2020271501315004e-08,
                    4.4274949072591736e-09,
                    1.6286696915715724e-09,
                    5.999405667521397e-10,
                    2.2114919040813106e-10,
                    8.10883433736032e-11,
                    3.0019226443461416e-11,
                    1.115383846606794e-11,
                    4.018424297688456e-12,
                    7.456425915102443e-13,
                    4.894586549584451e-13,
                    1.6010964826427115e-12,
                    2.2330531509029034e-12,
                    1.5679762826784357e-12,
                    1.0032745790594848e-12,
                    7.888188200058212e-13,
                    1.0961718779748406e-12,
                    1.7636850557484368e-12,
                    1.9068538510999752e-12,
                    1.6111068639722098e-12,
                    8.467906086653067e-13,
                    3.732895308995287e-13,
                    1.6292011124306858e-13,
                    2.437967782501133e-13,
                    -2.7538334077001913e-13,
                    -2.0058827804872164e-13,
                    -2.488604204551287e-13,
                    -6.003848525225113e-13,
                    -4.992760800355712e-13,
                    -1.1515456518420195e-13,
                    -8.302382051793255e-14,
                    -1.3761688717227188e-13,
                    2.9391434024293585e-13,
                    2.3002766650652255e-13,
                    1.2785331409241648e-13,
                    1.7169851260185206e-13,
                    4.4456422676263766e-14,
                    -7.609415566001192e-14,
                    2.2864349255324168e-14,
                    4.3652021376542626e-14,
                    -8.528618663616205e-14,
                    -3.552039539463333e-14,
                    1.1673485290637044e-13
                  ],
                  "name": "GFP"
                }
              ],
              "x_axis": [
                0.0,
                0.05,
                0.1,
                0.15000000000000002,
                0.2,
                0.25,
                0.3,
                0.35,
                0.39999999999999997,
                0.44999999999999996,
                0.49999999999999994,
                0.5499999999999999,
                0.6,
                0.65,
                0.7000000000000001,
                0.7500000000000001,
                0.8000000000000002,
                0.8500000000000002,
                0.9000000000000002,
                0.9500000000000003,
                1.0000000000000002,
                1.0500000000000003,
                1.1000000000000003,
                1.1500000000000004,
                1.2000000000000004,
                1.2500000000000004,
                1.3000000000000005,
                1.3500000000000005,
                1.4000000000000006,
                1.4500000000000006,
                1.5000000000000007,
                1.5500000000000007,
                1.6000000000000008,
                1.6500000000000008,
                1.7000000000000008,
                1.7500000000000009,
                1.800000000000001,
                1.850000000000001,
                1.900000000000001,
                1.950000000000001,
                2.000000000000001,
                2.0500000000000007,
                2.1000000000000005,
                2.1500000000000004,
                2.2,
                2.25,
                2.3,
                2.3499999999999996,
                2.3999999999999995,
                2.4499999999999993,
                2.499999999999999,
                2.549999999999999,
                2.5999999999999988,
                2.6499999999999986,
                2.6999999999999984,
                2.7499999999999982,
                2.799999999999998,
                2.849999999999998,
                2.8999999999999977,
                2.9499999999999975,
                2.9999999999999973
              ]
            }

    """
    try:
        d = Design.query.get(id)
        system, var_mapper = get_system_from_design(id)
        if not system: raise Exception("Cannot find the system.")

        ODEModel, system, names = getModel(system)
        if not ODEModel: raise Exception("Build ODE system error.")

        initval = get_initval_from_system(system, var_mapper)
        t, result = simulate(ODEModel, names, 0, 3.0, 0.05, initval)

        for ind, ele in enumerate(result):
            if ele['name'] in var_mapper:
                result[ind]['name'] = var_mapper[ele['name']]

        return jsonify(x_axis=t, variables=result, name=d.name)
    except Exception, e:
        print e
        return jsonify(x_axis=[], variables=[], name=d.name)

    # example data 
    #   d = Design.query.get(id)
    #   ODEModel, names = getModel(__example_system)
    #   t, result = simulate(ODEModel, names, 0, 3.0, 0.05, [0.]*len(names))



@modeling.route('/design/<int:id>', methods=["POST"])
def replot_design(id):
    """
        :Method: POST 
        :Usage: Get the modeling result of a design with parameters.
        :Output: A list of modeling result.
        :Example Output: The same as the output of :http:get:`/modeling/design/<int:id>` .
    """


    try:
        d = Design.query.get(id)
        system, var_mapper = get_system_from_design(id)
        if not system: raise Exception("Cannot find the system.")

        ODEModel, system, names = getModel(system)
        if not ODEModel: raise Exception("Build ODE system error.")
        initval = get_initval_from_system(system, var_mapper)

        data = request.get_json()
        maximum = float(data.get('maximum-time', 3.0))
        interval = float(data.get('interval', 0.05))

        for ind, ele in enumerate(names):
            if ele in var_mapper:
                ele = var_mapper[ele]
            if data.has_key(ele):
                initval[ind] = float(data.get(ele, 0.0))
        print initval

        t, result = simulate(ODEModel, names, 0, maximum, interval, initval)

        for ind, ele in enumerate(result):
            if ele['name'] in var_mapper:
                result[ind]['name'] = var_mapper[ele['name']]

        return jsonify(x_axis=t, variables=result, name=d.name)
    except Exception, msg:
        print traceback.format_exc()
        return jsonify(x_axis=[], variables=[], name=d.name)

