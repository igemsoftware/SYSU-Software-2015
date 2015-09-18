# -*- coding: utf-8 -*-

from . import TestCase

from server.models import Device, ComponentPrototype, ComponentInstance, \
        Relationship, Design
from server import db

class TestFunction(TestCase):

#   def test_component(self):
#       c = ComponentInstance('Promotor')
#       assert c.partID == 'Promotor'

#       c = ComponentInstance(100)
#       assert c.partID == 'None'

    def test_relationship(self):
        pro = ComponentPrototype.query.get(2)
        rbs = ComponentPrototype.query.get(3)

        r = Relationship(start=pro, end=rbs, type='Normal') 
        db.session.add(r)
        db.session.commit()

        assert pro.point_to.all() != []
        assert pro.be_point.all() == []
        assert rbs.point_to.all() == []
        assert rbs.be_point.all() != []

    
    def test_Device(self):
        d = Device(title='test')
        d.commit_to_db() # use this method to commit

        assert d.parts == [] 
        assert d.relationship == [] 

        c1 = d.add_component_by_id(2)
        assert len(d.parts) == 1
        assert d.parts[0].positionX == 300.0

        c2 = d.add_component_by_id(2, partID='Promotor 2', positionX=0.3)
        d.add_connection(c1.partID, c2.partID, 'Promote')

        d.commit_to_db() # use this method to commit
        d.update_from_db() # use this method to get

        assert d.parts[1].positionX == 0.3
        assert d.parts[0].partID == 'Promotor'
        assert d.parts[1].partID == 'Promotor 2'
        assert d.relationship[0]['start'] == c1.partID
        assert d.relationship[0]['end'] == c2.partID
        assert d.relationship[0]['type'] == 'Promote'




