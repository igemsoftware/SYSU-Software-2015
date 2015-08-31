# -*- coding: utf-8 -*-

from . import taskhall
from ..models import Task
from ..tools.parser import json_parser

from flask import request, current_app, jsonify

@taskhall.route('/list')
def get_task_list():
    page = request.args.get('page', 1, type=int) 
    per_page = request.args.get('per_page', 
            current_app.config['FLASKY_TASKS_PER_PAGE'], type=int)
    keyword = request.args.get('keyword', 'time', type=str)

    order_obj = {'time': Task.timestamp.desc(),
                 'vote': Task.votes.desc(),
                 'view': Task.views.desc(),
                }
    pagination = Task.query.order_by(order_obj.get(keyword, Task.timestamp.desc())).paginate(
            page, per_page=per_page, error_out=False)

    tasks = map(json_parser, pagination.items)
    return jsonify(tasks=tasks)

