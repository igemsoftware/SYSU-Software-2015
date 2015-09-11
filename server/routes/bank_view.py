# -*- coding: utf-8 -*-

from . import bank
from ..models import Design, User
from .. import login_manager, db

from flask import render_template, jsonify, request, \
        current_app, url_for, redirect
from flask.ext.login import login_required, current_user
from sqlalchemy import or_
from datetime import datetime

@bank.route('/')
def index():
    return render_template('bank.html')

@bank.route('/list')
def get_list():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page',
            current_app.config['FLASKY_DESIGNS_PER_PAGE'], type=int)
    order = request.args.get('order', 'id', type=str)
    keyword = request.args.get('keyword', '', type=str)
    mode = request.args.get('mode', 'public', type=str)

    order_obj = {
                 'id': Design.id.asc(),
                 'used': Design.used.desc(),
                 'rate': Design.rate.desc(),
                 'last-active': Design.last_active.desc(),
                }

    if mode == "share":
        if current_user.is_anonymous():
            """ authentic check """
            return jsonify(error=1, aux=url_for(login_manager.login_view, next=url_for('bank.index')) )
        query_obj = current_user.designs.filter(Design.is_shared==True)
    else:
        query_obj = Design.query.filter(Design.is_public==True)

    all_list = query_obj.\
            filter(or_(Design.name.like('%'+keyword+'%'),\
                       Design.brief_description.like('%'+keyword+'%'))\
                  ).\
            order_by(order_obj.get(order, Design.id.asc()))
    pagination = all_list.paginate(page, per_page=per_page, error_out=False)

    l = []
    for d in pagination.items:
        l.append({'id': d.id,
                  'name': d.name,
                  'description': d.brief_description,
                  'contributor': d.owner.username,
                  'rate': d.rate,
                  'comments': d.comments.count(),
                  'last active': d.last_active.strftime('%Y-%m-%d %H:%M:%S'),
                  'used': d.used,
                 })

    return jsonify(designs=l, count=all_list.count())

@bank.route('/share', methods=["POST"])
@login_required
def share_design():
    id = request.form.get('Design', -1)
    d = Design.query.get(id)
    if not d or d.owner != current_user: 
        return redirect(url_for('bank.index'))#jsonify(msg='false')

    d.is_shared = d.is_public = True
    d.full_description = request.form.get('full_description', '')
    d.brief_description = request.form.get('brief_description', '')
    d.last_active = datetime.now()
    db.session.add(d)
    db.session.commit()

    return redirect(url_for('bank.index'))

@bank.route('/finishedList/')
@login_required
def get_finished_list(): 
    l = []
    for d in current_user.designs.filter_by(is_shared=False).filter_by(is_finished=True).all():
        l.append({'id':d.id, 'name': d.name})
    return jsonify(finishedList = l)

