# -*- coding: utf-8 -*-

from . import calendar
from .. import db
from ..models import Memo
from ..tools.parser import json_parser

from flask.ext.login import login_required, current_user
from flask import request, jsonify, render_template, json

from sqlalchemy import or_
from datetime import datetime, timedelta

@calendar.route('/day/<string:date>') 
@login_required
def get_day(date): 
    today = datetime.strptime(date, '%y-%m-%d') 
    tomorrow = datetime.strptime(date, '%y-%m-%d')+timedelta(days=1)

    l = current_user.get_memos_during(today, tomorrow)
    l = map(lambda x: x.calendar_jsonify(), l)
    return jsonify(event=l)
    

@calendar.route('/all', methods=["GET"]) 
@login_required
def get_all(): 
    l = Memo.query.filter_by(owner=current_user).all()
    l = map(lambda x: x.calendar_jsonify(), l)
    return jsonify(events=l)

@calendar.route('/all', methods=["POST"]) 
@login_required
def post_all(): 
#    events = json.loads( request.form.get('events', []) )
    events = request.get_json()
    for event in events:
        id = event['id']
        title = event['title']
        start_time = datetime.strptime(event['start'], '%Y/%m/%d %H:%M')
        end_time = datetime.strptime(event['end'], '%Y/%m/%d %H:%M')
        protocol = event['protocol']
        error = event['error']
        record = event['record']

        if id == -1:
            m = Memo()
            db.session.add(m)
        else:
            m = Memo.query.get(id)
        m.title = title
        m.start_time = start_time
        m.time_scale = (end_time-start_time).seconds/60
        m.protocol = protocol
        m.error = error
        m.record = record
        current_user.memos.append(m)
        db.session.add(m)

    return 'Success'

@calendar.route('/all', methods=["DELETE"]) 
@login_required
def delete_all(): 
    id = request.form.get('id', 0)
    m = Memo.query.get(id)
    if m: db.session.delete(m)
    return 'Success'
