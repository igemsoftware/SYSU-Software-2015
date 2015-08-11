# parts:
#   id (databased, used to identify in program)
#   type (? system/registry/custom)
#   name ( unique)
#   bbo_id ( if existed )
#   


# function:
#   relatived part ( many to many )
#   function describe ( tex )
#   function exec ( matlab or python) 
#
#   graph, preprocessed, data, ...


# system/device/xxx:
#    type (all group are generalized into one)
#    related part
#
#

# user will have a custom list

# work
#   parts:
#     x, y, connection, in_graph_id

# when a thing is added into databased, update all





#    json/sql prototype
#    json/sql instance
from .. import db
import json

class Relationship(db.Model):
    start_id = db.Column(db.Integer, db.ForeignKey('componentprototypes.id'),
                            primary_key=True)
    end_id = db.Column(db.Integer, db.ForeignKey('componentprototypes.id'),
                            primary_key=True)
    type = db.Column(db.String(64), default='normal')

class ComponentPrototype(db.Model):
    __tablename__ = 'componentprototypes'
    
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String, unique=True)
    doc = db.Column(db.Text) 
    sequence = db.Column(db.Text, default='')
    # picture ...
    
    point_to = db.relationship('Relationship', 
                               foreign_keys=[Relationship.start_id],
                               backref=db.backref('start', lazy='joined'),
                               lazy='dynamic',
                               cascade='all, delete-orphan')
    be_point = db.relationship('Relationship', 
                               foreign_keys=[Relationship.end_id],
                               backref=db.backref('end', lazy='joined'),
                               lazy='dynamic',
                               cascade='all, delete-orphan')
    type = db.Column(db.String(64), default='None')

class ComponentInstance():
    def __init__(self, prototype_id, alias=None, x=0., y=0., local_id=-1):
        c = ComponentPrototype.query.get(prototype_id)
        if c is None:
            prototype_id = 1 # empty component
            c = ComponentPrototype.query.get(prototype_id)

        self.prototype_id = prototype_id
        self.local_id = local_id 
        self.name = c.name
        # can retrieve by querying
        # self.doc = c.doc
        # self.sequence = c.sequence

        self.x = x
        self.y = y
        self.alias = alias if alias else self.name 

    def jsonify(self):
        return {
                    'alias': self.alias,
                    'local_id': self.local_id,
                    'prototype_id': self.prototype_id,
                    'x': self.x,
                    'y': self.y,
               }

    def __repr__(self):
        return repr(self.jsonify())

class Work(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(32))
    log = db.Column(db.Text)

    content = db.Column(db.Text)

    local_id = db.Column(db.Integer, default=0)
    
    def __init__(self, **kwargs):
        self.components = []
        self.connections = []
        super(Work, self).__init__(**kwargs)

    def update_from_db(self):
        #print self.connections
        json_obj = json.loads(self.content)
        self.components = map(lambda x: ComponentInstance(**x), json_obj['components'])
        self.connections = json.loads((json_obj['connections'] ))
        
    def commit_to_db(self):
#        print self.connections
        json_obj = {
                        'components': map(lambda x: x.jsonify(), self.components),
                        'connections': json.dumps(self.connections)
                   }
        self.content = json.dumps(json_obj)

        db.session.add(self)
        db.session.commit()

    def clear(self):
        self.components = []
        self.connections = []

    def add_component_by_id(self, component_id, **kwargs):
        c = ComponentInstance(prototype_id=component_id, local_id=self.local_id, **kwargs)
        self.local_id += 1
        self.components.append(c)
        return c

    def add_component_by_name(self, component_name, **kwargs):
        c_prototype = ComponentPrototype.query.filter_by(name=component_name).all()
        if c_prototype:
            c_prototype = c_prototype[0]
        else:
            c_prototype = ComponentPrototype.query.get(1)

        c = ComponentInstance(prototype_id=c_prototype.id, local_id=self.local_id, **kwargs)
        self.local_id += 1
        self.components.append(c)
        return c

    def add_connection(self, x, y, r):
        self.connections.append({'from':x, 'to':y, 'relationship':r})

    # how to select a component? 
    def del_component(self, local_id):
        self.components.remove(local_id)

    def get_connected_matrix(self):
        m = dict([(ele.local_id, []) for ind, ele in enumerate(self.components)])
        for c in self.connections:
            m[c['from']].append(c['to'])
            m[c['to']].append(c['from'])
        return m




# uselesss
#   class ComponentInstance(db.Model):
#       id = db.Column(db.Integer, primary_key=True)

#       alias = db.Column(db.String)
#       prototype_id = db.Column(db.Integer, db.ForeignKey('ComponentPrototype.id')) 

#       coordinate_x = db.Column(db.Integer) 
#       coordinate_y = db.Column(db.Integer)  

