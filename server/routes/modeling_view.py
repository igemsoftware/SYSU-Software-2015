# -*- coding: utf-8 -*-

from . import modeling 
from flask import render_template, jsonify
from ..tools.simulation.release import getModel, simulate, __example_system
from ..models import EquationBase, Design 

# /modeling/
@modeling.route('/')
def modeling_index():
    return render_template('modeling.html')

@modeling.route('/design/<int:id>')
def plot_design(id):
    d = Design.query.get(id)
    d.update_from_db()
    design_set = [ele['partAttr'] for ele in d.parts]

    system = []
    system_set = set({})
    for e in EquationBase.query.order_by(EquationBase.related_count.desc()).all():
        e.update_from_db()
        # Find the max match
        if e.target in system_set: continue
        # Filter
        if e.target not in design_set: continue
        if design_set <= e.all_related:
            system.append(e.packed())
            system_set.update([e.target])
    print system_set


    ODEModel, names = getModel(system)
    t, result = simulate(ODEModel, names, 0, 3.0, 0.05, [0.]*len(names))
    return jsonify(x_axis=t, variables=result) 



