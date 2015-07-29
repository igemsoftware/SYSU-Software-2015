from . import main
from flask import render_template, jsonify, request, current_app

@main.route('/')
def index():
    return render_template('index.html')
