# -*- coding: utf-8 -*-

from . import modeling 
from flask import render_template, jsonify
from ..tools.simulation.release import getModel, simulate, __example_system
from ..models import EquationBase, Circuit

# /modeling/
@modeling.route('/')
def modeling_index():
    return render_template('modeling.html')

@modeling.route('/circuit/<int:id>')
def plot_circuit(id):
    c = Circuit.query.get(id)
    c.update_from_db()
    

    ODEModel, names = getModel(__example_system)
    t, result = simulate(ODEModel, names, 0, 3.0, 0.05, [0,0,0,0,0,0])
    return jsonify(x_axis=t, variables=result) 


