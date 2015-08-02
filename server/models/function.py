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

class ComponentPrototype(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String, unique=True)
    # url, descriptions or something
    doc = db.Column(db.Text) 
    # DNA sequence. The component is a not a DNA sequence if sequence is empty  
    sequence = db.Column(db.String, default='')
    # picture ...

    # Instances of this Component 
    # instances = db.relationship('ComponentInstance', backref='prototype', lazy='dynamic')
    # instance is in json 

    def jsonify(self):
        return {
                'name': self.name,
                'doc' : self.doc,
                'sequence': self.sequence 
               }

# uselesss
#   class ComponentInstance(db.Model):
#       id = db.Column(db.Integer, primary_key=True)

#       alias = db.Column(db.String)
#       prototype_id = db.Column(db.Integer, db.ForeignKey('ComponentPrototype.id')) 

#       coordinate_x = db.Column(db.Integer) 
#       coordinate_y = db.Column(db.Integer)  


class ComponentInstance():
    def __init__(self, component_id, alias=None, x=0., y=0.):
        c = ComponentPrototype.query.get(component_id)
        if c is None:
            component_id = 1 # empty component
            c = ComponentPrototype.query.get(component_id)

        self.component_id = component_id
        self.name = c.name
        self.doc = c.doc
        self.sequence = c.sequence

        self.x = x
        self.y = y
        self.alias = alias if alias else self.name 

    def jsonify(self):
        return {
                    'component_id': self.component_id,
                    'alias': self.alias,
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
        self.content = ""

    def add_component_by_id(self, component_id, **kwargs):
        c = ComponentInstance(component_id=component_id, **kwargs)
        self.components.append(c)

    def add_component_by_name(self, component_name, **kwargs):
        c_prototype = ComponentPrototype.query.filter_by(name=component_name).all()
        if c_prototype:
            c_prototype = c_prototype[0]
        else:
            c_prototype = ComponentPrototype.query.get(1)

        c = ComponentInstance(component_id=c_prototype.id, **kwargs)
        self.components.append(c)


    def add_connection(self, x, y):
#        if x > y:
#            x, y = y, x
        if not [x, y] in self.connections:
            self.connections.append([x, y])

    # how to select a component? 
    def del_component(self, local_id):
        self.components.remove(local_id)











