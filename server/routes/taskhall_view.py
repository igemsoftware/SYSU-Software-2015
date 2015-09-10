# -*- coding: utf-8 -*-

from . import taskhall
from .. import db
from ..models import Task, Answer, Comment
from ..tools.parser import json_parser

from flask import request, current_app, jsonify, \
        render_template, abort, redirect, url_for
from flask.ext.login import login_required, current_user
from datetime import datetime
from sqlalchemy import or_, not_

@taskhall.route('/')
@taskhall.route('/index')
def taskhall_index():
    return render_template('task/taskhall.html')

@taskhall.route('/list')
def get_task_list():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page',
            current_app.config['FLASKY_TASKS_PER_PAGE'], type=int)
    order = request.args.get('order', 'time', type=str)
    keyword = request.args.get('keyword', '', type=str)
    unanswered = request.args.get('unanswered', False, type=bool)

    order_obj = {'time': Task.timestamp.desc(),
                 'vote': Task.votes.desc(),
                 'view': Task.views.desc(),
                }
    pagination = Task.query.filter(or_(not unanswered, not_(Task.answers))).\
            filter(Task.title.like('%'+keyword+'%')).\
            order_by(order_obj.get(order, Task.timestamp.desc())).\
            paginate(page, per_page=per_page, error_out=False)

    tasks = map(lambda x: x.jsonify(), pagination.items)
    return jsonify(tasks=tasks)


@taskhall.route('/detail/<int:id>')
def task_detail(id):
    t = Task.query.get(id)
    if not t: abort(404)
    t.views += 1
    db.session.add(t)
    return render_template('task/detail.html', task=t)

@taskhall.route('/action/vote', methods=["POST"])
def vote_a_task():
    data = request.get_json()

    task_id = data['task_id']
    t = Task.query.get(task_id)
    if not t: abort(404)
    t.vote += 1
    db.session.add(t)

    return 'success' 

@taskhall.route('/action/answer', methods=["POST"])
@login_required
def answer_a_task():
    task_id = request.form.get('task_id', 0)
    t = Task.query.get(task_id)
    if not t: abort(404)

    a = Answer(content=request.form.get('content', ''))
    a.owner = current_user
    a.task = t
    t.active_time = datetime.now()
    db.session.add(a)
    db.session.add(t)
    db.session.commit()

    return redirect(url_for('taskhall.task_detail', id = task_id) )

@taskhall.route('/action/comment', methods=["POST"])
@login_required
def comment_a_answer():
    answer_id = request.form.get('answer_id', 0)
    a = Answer.query.get(answer_id)
    if not a: abort(404)

    c = Comment(content=request.form.get('content', ''))
    c.owner = current_user
    c.answer = a
    db.session.add(c)
    db.session.add(a)
    db.session.commit()

    return redirect(url_for('taskhall.task_detail', id = a.task.id) )


@taskhall.route('/action/store', methods=["POST"])
@login_required
def store_a_task():
    task_id = request.form.get('task_id', 0)

    if task_id < 0:
        t = Task()
    else:
        t = Task.query.get(task_id)
    if not t: abort(404)

    t.title = request.form.get('title', 0)
    t.content = request.form.get('content', 0)
    t.owner = current_user
    db.session.add(t)

    return redirect(url_for('taskhall.task_detail', id = t.id) )



# create task: Form
# answer: form 
# comment: form 
# vote: json
