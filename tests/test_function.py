from . import TestCase

from server.models import Work, ComponentPrototype, ComponentInstance, Relationship
from server import db

class TestWork(TestCase):

    def test_component(self):
        c = ComponentInstance('Promotor')
        assert c.partID == 'Promotor'

        c = ComponentInstance(100)
        assert c.partID == 'None'

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

    
    def test_work(self):
        w = Work(title='test', doc='asdf')
        w.commit_to_db() # use this method to commit

        assert w.parts == [] 
        assert w.relationship == [] 

        c1 = w.add_component_by_id(2)
        assert len(w.parts) == 1
        assert w.parts[0].positionX == 300.0

        c2 = w.add_component_by_id(2, partID='Promotor 2', positionX=0.3)
        w.add_component_by_name('foo', partID='haha 3')
        w.add_connection(c1.partID, c2.partID, 'Promote')

        w.commit_to_db() # use this method to commit
        w.update_from_db() # use this method to get

        assert w.parts[1].positionX == 0.3
        assert w.parts[0].partID == 'Promotor'
        assert w.parts[1].partID == 'Promotor 2'
        assert w.parts[2].partID == 'None'
        assert w.relationship[0]['start'] == c1.partID
        assert w.relationship[0]['end'] == c2.partID
        assert w.relationship[0]['type'] == 'Promote'




