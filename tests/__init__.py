# -*- coding: utf-8 -*-

from flask.ext.testing import TestCase as _TestCase

from server import create_app as _create_app
from server import db
from server.models import User, ComponentPrototype

class TestCase(_TestCase):

    def create_app(self):
        app = _create_app('testing')
        return app

    def setUp(self):
        db.drop_all()
        db.create_all()

        # administrator
        u = User(username='Administrator', email='SYSU.Software2015@gmail.com', password='SYSU.Software')
        db.session.add(u)
        db.session.commit()

        # add empty component prototype
        c = ComponentPrototype(name='None', introduction='This is the empty component')
        db.session.add(c)
        db.session.commit()

        # add testing component prototype
        pro = ComponentPrototype(name='Promotor', introduction='I\'m Promotor')
        rbs = ComponentPrototype(name='RBS', introduction='I\'m RBS')
        db.session.add_all([pro, rbs])
        db.session.commit()




    def tearDown(self):
        db.session.remove()
        db.drop_all()

