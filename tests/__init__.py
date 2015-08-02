from flask.ext.testing import TestCase as _TestCase

from server import create_app as _create_app
from server import db
from server.models import User, ComponentPrototype

class TestCase(_TestCase):

    def create_app(self):
        app = _create_app('testing')
        return app

    def setUp(self):
        db.create_all()

        # administrator
        u = User(username='Administrator', email='SYSU.Software2015@gmail.com', password='SYSU.Software')
        db.session.add(u)
        db.session.commit()

        # add empty component prototype
        c = ComponentPrototype(name='None', doc='This is the empty component', sequence='')
        db.session.add(c)
        db.session.commit()

        # add testing component prototype
        c = ComponentPrototype(name='Test Part1', doc='This is test part no. 1', sequence='ATCG')
        db.session.add(c)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

