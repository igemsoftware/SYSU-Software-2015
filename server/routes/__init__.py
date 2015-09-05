# -*- coding: utf-8 -*-

from flask import Blueprint

main = Blueprint('main', __name__)
auth = Blueprint('auth', __name__)
pic = Blueprint('pic', __name__)

person = Blueprint('person', __name__)
db = Blueprint('db', __name__)
design = Blueprint('design', __name__)
taskhall = Blueprint('taskhall', __name__)
calendar = Blueprint('calendar', __name__)
protocol = Blueprint('protocol', __name__)

views = [(main, ''),
         (auth, '/auth'),
         (pic,  '/pic'),
         (person, '/person'),
         (db, '/db'),
         (design, '/design'),
         (taskhall, '/taskhall'),
         (calendar, '/calendar'),
         (protocol, '/protocol'),
         ]

from . import main_view,\
            auth_view, \
            pic_view,\
            person_view,\
            db_view, \
            design_view,\
            taskhall_view,\
            calendar_view,\
            protocol_view
