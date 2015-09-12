# -*- coding: utf-8 -*-

from . import TestCase

from server.models import EquationBase, Equation
from server import db

class TestEquationBase(TestCase):

    def test_basic(self):
        e = EquationBase()

        e.target = 'A'
        e.realted = ['C', 'D']
        e.parameter = {'alpha':0.1}
        e.formular = '{{alpha}}*A/C'
        
        e.commit_to_db()
        e.update_from_db()
        
        e2 = Equation()
        e2.content = e.formular
        e2.parameters = e.parameter
        assert e2.render() == '0.1*A/C'

