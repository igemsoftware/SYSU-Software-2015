# -*- coding: utf-8 -*-

from . import bank

from flask import render_template, \
        jsonify, request, current_app
from ..models import Design, User
from sqlalchemy import or_

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

    order_obj = {
                 'id': Design.id.asc(),
                 'user': Design.owner_id.asc(),
                 'rate': Design.rate.desc(),
                 'last-active': Design.last_active.desc(),
                }

    pagination = Design.query.\
            filter(or_(Design.name.like('%'+keyword+'%'),\
                       Design.short_description.like('%'+keyword+'%'))\
                  ).\
            order_by(order_obj.get(order, Design.id.asc())).\
            paginate(page, per_page=per_page, error_out=False)

    l = []
    for d in pagination.items:
        l.append({'id': d.id,
                  'name': d.name,
                  'description': d.short_description,
                  'contributor': d.owner.username,
                  'rate': d.rate,
                  'comments': d.comments.count(),
                  'last active': d.last_active.strftime('%Y-%m-%d %H:%M:%S'),
                 })

    return jsonify(designs=l)


