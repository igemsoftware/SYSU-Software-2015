# -*- coding: utf-8 -*-

from . import calendar
from ..models import Memo
from ..tools.parser import json_parser

from flask.ext.login import login_required, current_user
from flask import request, jsonify, render_template

from sqlalchemy import or_
from datetime import datetime, timedelta

@login_required
@calendar.route('/day/<string:date>') 
def get_day(date): 
    today = datetime.strptime(date, '%y-%m-%d') 
    tomorrow = datetime.strptime(date, '%y-%m-%d')+timedelta(days=1)

    l = current_user.get_memos_during(today, tomorrow)
    l = map(json_parser, l)
    return jsonify(memos=l)
    

@login_required
@calendar.route('/all') 
def get_all(): 
    l = Memo.query.filter_by(owner=current_user).all()
    l = map(json_parser, l)
    return jsonify(memos=l)


