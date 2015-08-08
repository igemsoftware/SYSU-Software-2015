from . import TestCase

from server.models import Work, ComponentPrototype, ComponentInstance
from server import db

class TestWork(TestCase):

    def test_component(self):
        c = ComponentInstance(2)
        assert c.name == 'Test Part1'

        c = ComponentInstance(100)
        assert c.name == 'None'

    
    def test_work(self):
        w = Work(title='test', log='asdf')
        w.commit_to_db() # use this method to commit

        assert w.components == [] 
        assert w.connections == [] 

        w.add_component_by_id(2)
        assert len(w.components) == 1
        assert w.components[0].x == 0.0

        w.add_component_by_id(2, alias='haha', x=0.3)
        w.add_component_by_name('Test Part1', alias='haha 3')
        w.add_component_by_name('foo', alias='haha 3')
        w.add_connection(1, 2, 'promote')

        w.commit_to_db() # use this method to commit
        w.update_from_db() # use this method to get

        assert w.components[1].local_id == 1
        assert w.components[1].x == 0.3
        assert w.components[1].alias == 'haha'
        assert w.components[1].name == 'Test Part1'
        assert w.components[3].name == 'None'
        assert w.components[2].name == 'Test Part1'
        assert w.connections[0]['from'] == 1
        assert w.connections[0]['to'] == 2
        assert w.connections[0]['relationship'] == 'promote'



