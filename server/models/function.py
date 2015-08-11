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

    def __repr__(self):
        return '<Relationship: %s->%s>' % (self.start.name, self.end.name)

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

    def __repr__(self):
        return '<ComponentPrototype: %s>' % self.name

class ComponentInstance():
# jingjin's Model
    def __init__(self, prototype, id=None, positionX=300., positionY=300.):
        c = ComponentPrototype.query.filter_by(name=prototype).first()
        if c is None:
            print 'No prototype named %s' % prototype
            id = prototype = 'None'
            c = ComponentPrototype.query.filter_by(name=prototype).first()

        self.id = id if id else prototype
        self.prototype = prototype
        self.positionX = positionX
        self.positionY = positionY

    def jsonify(self):
        return {
                    'id': self.id,
                    'prototype': self.prototype,
                    'positionX': self.positionX,
                    'positionY': self.positionY,
               }
        
# Original Model
#   def __init__(self, prototype_id, alias=None, x=0., y=0., local_id=-1):
#       c = ComponentPrototype.query.get(prototype_id)
#       if c is None:
#           prototype_id = 1 # empty component
#           c = ComponentPrototype.query.get(prototype_id)

#       self.prototype_id = prototype_id
#       self.local_id = local_id 
#       self.name = c.name
#       # can retrieve by querying
#       # self.doc = c.doc
#       # self.sequence = c.sequence

#       self.x = x
#       self.y = y
#       self.alias = alias if alias else self.name 

#   def jsonify(self):
#       return {
#                   'alias': self.alias,
#                   'local_id': self.local_id,
#                   'prototype_id': self.prototype_id,
#                   'x': self.x,
#                   'y': self.y,
#              }

    def __repr__(self):
        return repr(self.jsonify())


class Work(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(32))
    doc = db.Column(db.Text)
    type = db.Column(db.String(32), default='Normal')

    content = db.Column(db.Text)

#    local_id = db.Column(db.Integer, default=0)
    
    def __init__(self, **kwargs):
        self.parts = []
        self.relationship = []
        self.interfaceA = ''
        self.interfaceB = ''
        super(Work, self).__init__(**kwargs)

    def update_from_db(self):
        #print self.connections
        json_obj = json.loads(self.content)
        self.parts = map(lambda x: ComponentInstance(**x), json_obj['parts'])
        self.relationship = json_obj['relationship'] 
        self.interfaceA = json_obj['interfaceA']
        self.interfaceB = json_obj['interfaceB']
        
    def commit_to_db(self):
#        print self.connections
        json_obj = {
                        'parts': map(lambda x: x.jsonify(), self.parts),
                        'relationship': self.relationship,
                        'interfaceA': self.interfaceA,
                        'interfaceB': self.interfaceB
                   }
        self.content = json.dumps(json_obj)

        db.session.add(self)
        db.session.commit()

    def clear(self):
        self.components = []
        self.connections = []

    def add_component_by_id(self, prototype_id, **kwargs):
        c_prototype = ComponentPrototype.query.get(prototype_id)
        if not c_prototype: 
            c_prototpye = ComponentPrototype.query.get(1)
        c = ComponentInstance(prototype=c_prototype.name, **kwargs)
        self.parts.append(c)
        return c

    def add_component_by_name(self, component_name, **kwargs):
        c = ComponentInstance(prototype=component_name, **kwargs)
        self.parts.append(c)
        return c

    def add_connection(self, x, y, r):
        self.relationship.append({'start':x, 'end':y, 'type':r})

    # how to select a component? 
    def del_component(self, local_id):
        self.relationship.remove(local_id)





    # load from file
    def __load_prototype_and_instance(self, name, type, new_instance):
        pname = name.split('_')[0]
        # add Prototype if not exist
        c = ComponentPrototype.query.filter_by(name=pname).first()
        if c==None:
            c = ComponentPrototype(name=pname, type=type)
        db.session.add(c)
        db.session.commit()

        # add component if not exist
        if new_instance:
            instance = self.add_component_by_name(pname, id=name)
        else:
            for ins in self.parts:
                if ins.id==name:
                    instance = ins
                    break

        return c, instance

    def load_from_file(self, filename):
        print 'loading %s ...' % filename
        f = open(filename, 'r')
        self.title = f.readline().strip()
        self.doc = f.readline().strip()
        self.type = f.readline().strip()
        self.interfaceA, self.interfaceB = f.readline().strip().split(',') 

        rec = set() 
        for line in f:
            if len(line.strip().split('\t')) != 5:
                raise Exception('Format error (No extra empty line after the table).')
            A_name, A_type, B_name, B_type, R_type = line.strip().split('\t')

            # add a
            A_prototype, A_instance = self.__load_prototype_and_instance(A_name, A_type, not A_name in rec)
            rec.add(A_name)

            # add b
            B_prototype, B_instance = self.__load_prototype_and_instance(B_name, B_type, not B_name in rec)
            rec.add(B_name)

            # add relationship for prototype
            if not Relationship.query.filter_by(start=A_prototype, end=B_prototype, type=R_type).all():
                r = Relationship(start=A_prototype, end=B_prototype, type=R_type)
                db.session.add(r)

            # add relationship for instance
            self.add_connection(A_instance.id, B_instance.id, R_type)

        self.commit_to_db()
        from pprint import pprint
        pprint(json.loads(self.content))
        return self





# uselesss
#   class ComponentInstance(db.Model):
#       id = db.Column(db.Integer, primary_key=True)

#       alias = db.Column(db.String)
#       prototype_id = db.Column(db.Integer, db.ForeignKey('ComponentPrototype.id')) 

#       coordinate_x = db.Column(db.Integer) 
#       coordinate_y = db.Column(db.Integer)  

