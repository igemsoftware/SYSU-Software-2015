from . import TestCase

from server.models import Work, ComponentPrototype, ComponentInstance, Relationship
from server import db

class TestWork(TestCase):

    def test_component(self):
        c = ComponentInstance(2)
        assert c.name == 'Promotor'

        c = ComponentInstance(100)
        assert c.name == 'None'

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
        w = Work(title='test', log='asdf')
        w.commit_to_db() # use this method to commit

        assert w.components == [] 
        assert w.connections == [] 

        w.add_component_by_id(2)
        assert len(w.components) == 1
        assert w.components[0].x == 0.0

        w.add_component_by_id(2, alias='Promotor 2', x=0.3)
        w.add_component_by_name('foo', alias='haha 3')
        w.add_connection(1, 2, 'Promote')

        w.commit_to_db() # use this method to commit
        w.update_from_db() # use this method to get

        assert w.components[1].local_id == 1
        assert w.components[1].x == 0.3
        assert w.components[0].alias == 'Promotor'
        assert w.components[1].alias == 'Promotor 2'
        assert w.components[2].name == 'None'
        assert w.connections[0]['from'] == 1
        assert w.connections[0]['to'] == 2
        assert w.connections[0]['relationship'] == 'Promote'



