from . import person
from ..models import Circuit

from flask.ext.login import current_user, login_required
from flask import jsonify, json, render_template

@person.route('/')
@login_required
def index():
    return render_template('person/personal_center.html')

def __parser(o):
    o = json.loads(json.dumps(o.__dict__, default=repr))
    o['content'] = json.loads(o['content'])
    return o

@person.route('/mine')
@login_required
def mine():
    l = Circuit.query.filter_by(owner=current_user).all()
    l = map(Circuit.jsonify, l)
    return jsonify(mine=l)

@person.route('/favorite')
@login_required
def favorite():
    l = current_user.favorite_circuits
    l = map(Circuit.jsonify, l)
    return jsonify(favorite=l)

