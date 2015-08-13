from . import person

from flask.ext.login import current_user
from flask import jsonify, json


@person.route('/')
def index():
    return repr(current_user.__dict__)

