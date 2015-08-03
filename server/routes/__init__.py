from flask import Blueprint

main = Blueprint('main', __name__)
auth = Blueprint('auth', __name__)
pic = Blueprint('pic', __name__)

views = [(main, ''),
         (auth, '/auth'),
         (pic,  '/pic')]

from . import main_view, auth_view, pic_view
