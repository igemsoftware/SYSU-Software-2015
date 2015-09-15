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
    """
        :Method: GET
        :Note: Login required.
        :Usage: To get your :attr:`Memo` in a specific day.
        :Input: a date in ``<year>-<month>-<day>`` format.
        :Output: a json array named ``event``.
        :Example: see calendar-example_. 
    """
    today = datetime.strptime(date, '%y-%m-%d') 
    tomorrow = datetime.strptime(date, '%y-%m-%d')+timedelta(days=1)

    l = current_user.get_memos_during(today, tomorrow)
    l = map(lambda x: x.calendar_jsonify(), l)
    return jsonify(event=l)
    
@calendar.route('/all', methods=["GET"]) 
@login_required
def get_all(): 
    """
        :Method: GET
        :Note: Login required.
        :Usage: To get all your :attr:`Memo`.
        :Output: a json array named ``event``.

        .. _calendar-example:

        :Output Example:

        .. code-block:: json

            {
              "events": [
                {
                  "end": "2015/08/09 00:00",
                  "error": "No errors occured",
                  "id": 1,
                  "protocol": "2-3",
                  "record": "Things went well",
                  "start": "2015/08/08 00:00",
                  "title": "Experiment #34"
                },
                {
                  "end": "2015/09/05 08:00",
                  "error": "Wish not",
                  "id": 2,
                  "protocol": "No",
                  "record": "Maybe a pill will help",
                  "start": "2015/09/04 23:46",
                  "title": "Time to sleep"
                }
              ]
            }

    """
    l = Memo.query.filter_by(owner=current_user).all()
    l = map(lambda x: x.calendar_jsonify(), l)
    return jsonify(events=l)

@calendar.route('/all', methods=["POST"]) 
@login_required
def post_all(): 
    """
        :Method: POST 
        :Content-type: application/json
        :Note: Login required.
        :Usage: To update all your :attr:`Memo`.
        :Input: A json array.
        :Output: A success message. 
        :Input Example: 

        .. code-block:: json

            [{ 
                "end": "2015/08/09 00:00", 
                "error": "", 
                "id": 1, 
                "protocol": "", 
                "record": "", 
                "start": "2015/08/08 00:00", 
                "title": "Long Sleep" 
            }]
    """
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
        if start_time >= end_time:
            end_time = start_time+timedelta(minutes=1)

        if id == -1:
            m = Memo()
            db.session.add(m)
        else:
            m = Memo.query.get(id)
        m.title = title
        m.plan_time = start_time
        m.time_scale = (end_time-start_time).total_seconds()/60
        m.protocol = protocol
        m.error = error
        m.record = record
        current_user.memos.append(m)
        db.session.add(m)
    db.session.commit()
    current_user.check_memo()
    print [ele['id'] for ele in events]

    l = Memo.query.filter_by(owner=current_user).all()
    l = map(lambda x: x.calendar_jsonify(), l)
    return jsonify(events=l)


@calendar.route('/all', methods=["DELETE"]) 
@login_required
def delete_all(): 
    """
        :Method: DELETE 
        :Note: Login required.
        :Usage: To deleta one of your :attr:`Memo`.
        :Output: A success message. 
        :Input: An 'id' field filled with id number.
    """

    id = request.form.get('id', 0)
    m = Memo.query.get(id)
    if m: db.session.delete(m)
    return 'Success'
