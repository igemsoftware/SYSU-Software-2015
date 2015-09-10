# -*- coding: utf-8 -*-

from . import modeling 
from flask import render_template, jsonify
from ..tools.simulation.release import getModel, simulate, __example_system
from ..models import EquationBase, Design 

# /modeling/
@modeling.route('/')
def modeling_index():
    return render_template('modeling.html')

@modeling.route('/design/all')
def design_all():
    l = []
    for d in Design.query.all():
        l.append({'title': d.title,
                  'id': d.id,
                  'img': d.img})
    return jsonify(designs=l)

 

@modeling.route('/design/<int:id>')
def plot_design(id):
    d = Design.query.get(id)
    d.update_from_db()
    design_set = set([ele['partAttr'] for ele in d.parts])

    system = []
    system_set = set({})
    for e in EquationBase.query.order_by(EquationBase.related_count.desc()).all():
        e.update_from_db()
        # Find the max match
        if e.target in system_set: continue
        # Filter
        if e.target not in design_set: continue
        # debug codes
#       print design_set
#       print e.all_related
#       print design_set >= e.all_related
        if design_set >= e.all_related:
            system.append(e.packed())
            system_set.update([e.target])
#   from pprint import pprint
#   pprint(system)

    ODEModel, names = getModel(system)
    if ODEModel == None:
        return jsonify(x_axis=[], variables=[], title=d.title)
    t, result = simulate(ODEModel, names, 0, 3.0, 0.05, [0.]*len(names))

# fake data 
#   d = Design.query.get(id)
#   ODEModel, names = getModel(__example_system)
#   t, result = simulate(ODEModel, names, 0, 3.0, 0.05, [0.]*len(names))
    return jsonify(x_axis=t, variables=result, title=d.title)
