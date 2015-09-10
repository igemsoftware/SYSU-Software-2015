# -*- coding: utf-8 -*-

from . import bank

from flask import render_template, jsonify  
from ..models import Design

@bank.route('/')
def index():
    return render_template('bank.html')

@bank.route('/list')
def get_list():
    l = []
    for d in Design.query.all():
        l.append({'id': d.id,
                  'name': d.name,
                  'description': d.short_description,
                  'contributor': d.owner.username,
                  'rate': d.rate,
                  'comments': d.comments.count(),
                  'last active': d.last_active.strftime('%Y-%m-%d %H:%M'),
                 })
    return jsonify(designs=l)




