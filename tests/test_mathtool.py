# -*- coding: utf-8 -*-

from . import TestCase

from server.tools.simulation.release import \
        getModel, simulate
from server.tools.simulation.release import __example_system as test_system
from server import db

from server.tools.classifier.logistic import LogisticRegression
from server.tools.classifier.logistic import __example_data as test_data 

class TestMathTool(TestCase):

    def testModeling(self):
        ODEModel, names, v_m = getModel(test_system)
        t, results = simulate(ODEModel, names, 0, 3.0, 0.05, [0,0,0,0,0,0])

        for ele in results:
            assert max(ele['data']) > 0

    def testClassifier(self):
        x, y = test_data

        c = LogisticRegression()
        c.fit(x, y, max_iteration = 10, plot_interval=1, lr=1)
        assert (c.theta != 0).sum() > 0


