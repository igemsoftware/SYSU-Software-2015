from flask.ext.testing import TestCase as _TestCase

from server import create_app as _create_app
from server import db

class TestCase(_TestCase):

    def create_app(self):
        app = _create_app('testing')
        return app

    def setUp(self):
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

