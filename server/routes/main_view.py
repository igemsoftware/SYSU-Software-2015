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

@main.route('/work/fetch/parts/<int:id>')
def work_fetch_parts(id):
    w = work_check_and_update(id)

    return jsonify(parts=map(lambda x: x.jsonify(), w.components))

@main.route('/work/fetch/relationship/<int:id>')
def work_fetch_relationship(id):
    w = work_check_and_update(id)
    
    return jsonify(relationship=w.connections)

@main.route('/work/fetch/cmatrix/<int:id>')
def work_fetch_cmatrix(id):
    w = work_check_and_update(id)

    return jsonify(cmatrix=w.get_connected_matrix())

