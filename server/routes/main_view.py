# -*- coding: utf-8 -*-

from . import main
from ..models import Design
from flask import render_template, jsonify, request, current_app, url_for, jsonify, abort
from flask.ext.login import login_required
import json
import urllib2
import xml.dom.minidom

@main.before_app_request 
def before_request():
    # update user's last seen
    # update some cookies or xxx
    pass

@main.route('/')
#@login_required
def index():
    """
        :Usage: The index
    """
    return render_template('index.html')

@main.route('/design')
@login_required
def design():
    """
        :Note: Login required
        :Usage: The redesign tools. 
    """

    return render_template('design.html')

@main.route('/experiment')
@login_required
def experiment():
    """
        :Note: Login required
        :Usage: The modeling tools. 
    """
    return render_template('experiment.html')

@main.route('/embedded/<int:id>')
def embedded(id):
    """
        :Usage: Get a design.
    """
    c = Design.query.get(id)
    return render_template('embedded.html', circuit=c)

@main.route('/proxy', methods=['POST'])
def proxy():
    parts = request.get_json(force=True)
    url = "http://parts.igem.org/cgi/xml/part.cgi?part="
    for part in parts:
        if not part['BBa'] == '':
            req = urllib2.Request(url = url+part['BBa'])
            res = urllib2.urlopen(req)
            dom = xml.dom.minidom.parseString(res.read())
            root = dom.documentElement
            part['cds'] = root.getElementsByTagName("seq_data")[0].childNodes[0].nodeValue.strip('\n')
            part['part_short_name'] = root.getElementsByTagName("part_short_name")[0].childNodes[0].nodeValue.strip('\n')
            part['part_short_des'] = root.getElementsByTagName("part_short_desc")[0].childNodes[0].nodeValue.strip('\n')
            part['length'] = len(part['cds'])
        else:
            part['cds'] = ''
            part['part_short_name'] = part['name']
            part['part_short_des'] = ''
            if part['type'] == 'promoter':
                part['length'] = 50
            if part['type'] == 'RBS':
                part['length'] = 20
            if part['type'] == 'gene':
                part['length'] = 600
            if part['type'] == 'terminator':
                part['length'] = 50
    return jsonify(circuit=parts)
