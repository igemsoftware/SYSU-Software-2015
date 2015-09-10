# -*- coding: utf-8 -*-

from . import bank

from flask import render_template

@bank.route('/')
def index():
    return render_template('bank.html')

