from . import person
from ..models import Circuit
from ..tools.parser import json_parser

from flask.ext.login import current_user, login_required
from flask import jsonify, json, render_template

@person.route('/')
@login_required
def index():
    return render_template('person/personal_center.html')

@person.route('/mine')
@login_required
def mine():
    l = Circuit.query.filter_by(owner=current_user).all()
    l = map(json_parser, l)
    return jsonify(mine=l)

@person.route('/favorite')
@login_required
def favorite():
    l = current_user.favorite_circuits
    l = map(json_parser, l)
    return jsonify(favorite=l)


@person.route('/notifications')
@login_required
def get_person_notifications():
    l = []
    for msg in current_user.msg_box:
        l.append({'id': msg.id,
                  'source': msg.source,
                  'content': msg.content,
                  'read': msg.isread})
    return jsonify(notifications=l)


@person.route('/notifications/id', methods=['POST'])
@login_required
def mark_notification_as_read(id):
    m = Message.query.get(id)
    if m:
        m.isread = True
        db.session.add(m)

@person.route('/notifications/id', methods=['DELETE'])
@login_required
def delete_notification(id):
    m = Message.query.get(id)
    if m:
        db.session.remove(m)





