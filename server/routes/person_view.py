# -*- coding: utf-8 -*-

from . import person
from .. import db
from ..models import Design, Message
from ..tools.parser import json_parser

from flask.ext.login import current_user, login_required
from flask import jsonify, json, render_template

@person.route('/')
@login_required
def index():
    """
        :Usage: The personal center page. 
    """
    return render_template('person/database.html')

@person.route('/notifs')
@login_required
def notifications():
    """
        :Usage: Message center.
    """
    return render_template('person/notifications.html')

@person.route('/mine')
@login_required
def mine():
    """
        :Usage: Get all my :class:`Circuit` .
    """

    l = Design.query.filter_by(owner=current_user).all()
    l = map(Design.jsonify, l)
    return jsonify(mine=l)

@person.route('/favorite')
@login_required
def favorite():
    """
        :Usage: :class:`User` 's favorite :class:`Circuit` .
    """
    l = current_user.favorite_designs
    l = map(Design.jsonify, l)
    return jsonify(favorite=l)


@person.route('/notifications')
@login_required
def get_person_notifications():
    """
        :Usage: Get :class:`Message` from :attr:`User.msg_box` . 
    """
    l = []
    for msg in current_user.msg_box:
        l.append({'id': msg.id,
                  'source': msg.source,
                  'content': msg.content,
                  'read': msg.isread})
    return jsonify(notifications=l)


@person.route('/notifications/<int:id>', methods=['POST'])
@login_required
def mark_notification_as_read(id):
    """
        :Method: POST
        :Usage: Mark :attr:`Message.isread` as `True`. 
    """
    m = Message.query.get(id)
    if m and m.receiver == current_user:
        m.isread = True
        db.session.add(m)
    return 'success'

@person.route('/notifications/<int:id>', methods=['DELETE'])
@login_required
def delete_notification(id):
    """
        :Method: DELETE 
        :Usage: Delete a :class:`Message` .
    """
    m = Message.query.get(id)
    if m and m.receiver == current_user:
        db.session.delete(m)
    return 'success'





