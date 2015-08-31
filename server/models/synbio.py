# -*- coding: utf-8 -*-

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


class ProtocolRecommend(db.Model):
    protocol_id = db.Column(db.Integer, db.ForeignKey('protocol.id'),
                            primary_key=True)
    device_id = db.Column(db.Integer, db.ForeignKey('device.id'),
                            primary_key=True)

    def __repr__(self):
        return '<ProtocolRecommend: %s->%s>' % (self.prototype.name, self.device.name)

class Protocol(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(128), default='', index=True)
    introduction = db.Column(db.Text, default='')
    content = db.Column(db.Text, default='')
    timescale = db.Column(db.Integer)

#    liked = db.Column(db.Integer, default=0)
#    used_times = db.Column(db.Integer, default=0)

    def load_from_file(self, filename):
        print 'loading protocol %s ...' % filename
        _introduction = []
        _component = []
        _procedure = []
        with open(filename, 'r') as f:
            self.name = f.readline().strip().decode('ISO-8859-1')
            self.recommend = f.readline().strip() == 'True'
            for line in f:
                line = line.strip()
                if line == 'Introduction':
                    ptr = _introduction
                elif line == 'Components':
                    ptr = _component
                elif line == 'Procedure':
                    ptr = _procedure
                else:
                    ptr.append(line.strip().decode('ISO-8859-1'))

        self.introduction = '\n'.join(_introduction)
        self.component = '\n'.join(_component)
        self.procedure = '\n'.join(_procedure)

        db.session.add(self)

        return self


    # used_times = db.Column(db.Integer, default=0)
    # timescale = db.Column(db.Integer)
#   recommend_to = db.relationship('ProtocolRecommend',
#                                  foreign_keys=[ProtocolRecommend.protocol_id],
#                                  backref=db.backref('protocol', lazy='joined'),
#                                  lazy='dynamic',
#                                  cascade='all, delete-orphan')

    recommend_to = db.relationship('ProtocolRecommend',
                                   foreign_keys=[ProtocolRecommend.protocol_id],
                                   backref=db.backref('protocol', lazy='joined'),
                                   lazy='dynamic',
                                   cascade='all, delete-orphan')

from equation import Equation

class Relationship(db.Model):
    start_id = db.Column(db.Integer, db.ForeignKey('componentprototype.id'),
                            primary_key=True)
    end_id = db.Column(db.Integer, db.ForeignKey('componentprototype.id'),
                            primary_key=True)
    type = db.Column(db.String(64), default='normal')

    @property
    def equation(self):
        return Equation(jsonstr=self.__equation)
    @equation.setter
    def equation(self, value):
        if isinstance(value, Equation):
            self.__equation = value.json_dumps()
        elif isinstance(value, dict):
            self.__equation = json.dumps(value)
        elif isinstance(value, str) or isinstance(value, unicode):
            self.__equation = value 
    __equation = db.Column(db.Text, default='')

    def __init__(self, **kwargs):
        super(Relationship, self).__init__(**kwargs)
        self.equation = {'parameters':{}, 'content':''}

    def __repr__(self):
        return '<Relationship: %s->%s>' % (self.start.name, self.end.name)


class ComponentPrototype(db.Model):
    __tablename__ = 'componentprototype'
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String) #unique=True)

    type = db.Column(db.String(64), default='None')
    introduction = db.Column(db.Text, default="No introduction yet.")
    source = db.Column(db.Text, default="Come from no where.")
    risk = db.Column(db.Integer, default="-1")
    BBa = db.Column(db.String, default='')
    bacterium = db.Column(db.String, default='')
    
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

    @property
    def attr(self):
        return self.name+':'+self.BBa if self.BBa else self.name

    def __repr__(self):
        return '<ComponentPrototype: %s>' % self.name

class ComponentInstance():
# jingjin's Model
    def __init__(self, partName, partID=None, positionX=300., positionY=300.):
        c = ComponentPrototype.query.filter_by(name=partName).first()
        if c is None:
            print 'No prototype named %s' % partName 
            partID = partName = 'None'
            c = ComponentPrototype.query.filter_by(name=partName).first()

        self.partID = partID if partID else partName 
        self.partName = partName 
        self.positionX = positionX
        self.positionY = positionY

    def jsonify(self):
        return {
                    'partID': self.partID,
                    'partName': self.partName,
                    'positionX': self.positionX,
                    'positionY': self.positionY,
               }

    def __repr__(self):
        return repr(self.jsonify())


class BioBase():
    content = db.Column(db.Text)
    def __init__(self):
        self.parts = []
        self.relationship = []
        self.interfaceA = ''
        self.interfaceB = ''

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
        c = ComponentInstance(partName=c_prototype.name, **kwargs)
        self.parts.append(c)
        return c

    def add_component_by_name(self, component_name, **kwargs):
        c = ComponentInstance(partName=component_name, **kwargs)
        self.parts.append(c)
        return c

    def add_connection(self, x, y, r):
        self.relationship.append({'start':x, 'end':y, 'type':r})

    # how to select a component? 
    def del_component(self, local_id):
        self.relationship.remove(local_id)

class Device(db.Model, BioBase):
    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(32))

    introduction = db.Column(db.Text, default="No introduction yet.")
    source = db.Column(db.Text, default="Come from no where.")
    risk = db.Column(db.Integer, default="-1")
    pic_url = db.Column(db.Text, default='')

    recommended_protocol = db.relationship('ProtocolRecommend',
                                   foreign_keys=[ProtocolRecommend.device_id],
                                   backref=db.backref('device', lazy='joined'),
                                   lazy='dynamic',
                                   cascade='all, delete-orphan')

    def __init__(self, **kwargs):
        # super(Work, self).__init__(**kwargs)
        BioBase.__init__(self)

    # load from file
    def __load_prototype_and_instance(self, name, new_instance):
        if len(name.split('_')) == 1:
            raise Exception('[%s] No underscore.' % name)

        pname, BBa = '_'.join(name.split('_')[:-1]), None
        if (len(pname.split(':')) >= 2):
            BBa = pname.split(':')[-1]
            pname = ':'.join(pname.split(':')[:-1])

            try:
                BBa.index('BBa')
            except:
                pname = ':'.join([pname,BBa])
                BBa = None

        # add Prototype if not exist
        if not BBa:
            c = ComponentPrototype.query.filter_by(name=pname).first()
            if c==None: raise Exception('No prototype [name=%s].'%pname)
        else:
            c = ComponentPrototype.query.filter_by(name=pname, BBa=BBa).first()
            if c==None: raise Exception('No prototype [name=%s, BBa=%s].'%(pname, BBa))

#           c = ComponentPrototype(name=pname, type=type)
#       db.session.add(c)
#       db.session.commit()

        # add component if not exist
        if new_instance:
            instance = self.add_component_by_name(pname, partID=name)
        else:
            for ins in self.parts:
                if ins.partID==name:
                    instance = ins
                    break

        return c, instance

    def load_from_file(self, filename):
        print 'loading device from %s ...' % filename
        f = open(filename, 'r')
        self.title = f.readline().strip()
        self.introduction = f.readline().strip().decode('ISO-8859-1')
        self.source = f.readline().strip()
        self.saferank = f.readline().strip()
        # self.type = f.readline().strip()
        self.interfaceA = f.readline().strip() 
        self.interfaceB = f.readline().strip() #.split(',') 

        rec = set() 
        for line in f:
            line = line.decode('ISO-8859-1')
            if len(line.strip(' \n').split('\t')) != 3:
                #raise Exception('Format error (No extra empty line after the table).')
#                print('Warning: Format error. Skip line [%s].'%line.strip(' \n'))
                continue
#            print '[%s]' % line
            A_name, B_name, R_type = line.strip(' \n').split('\t')

            print line
#           try:
#               line.index('LacI')
#               line.index('gfp')
#               raw_input('pause')
#           except:
#               pass

            # add a
            A_prototype, A_instance = self.__load_prototype_and_instance(A_name, not A_name in rec)
            rec.add(A_name)

            # add b
            B_prototype, B_instance = self.__load_prototype_and_instance(B_name, not B_name in rec)
            rec.add(B_name)

            # add relationship for prototype
            if not Relationship.query.filter_by(start=A_prototype, end=B_prototype).all(): #, type=R_type).all():
                r = Relationship(start=A_prototype, end=B_prototype, type=R_type)
                db.session.add(r)

            # add relationship for instance
            self.add_connection(A_instance.partID, B_instance.partID, R_type)

       # print 'here' 
        self.commit_to_db()

#       from pprint import pprint
#       pprint(json.loads(self.content))
        
        return self


from datetime import datetime

Favorite_circuit = db.Table('Favorite_circuit',
    db.Column('circuit_id', db.Integer, db.ForeignKey('circuit.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'))
)

class Circuit(db.Model, BioBase):
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id')) 

    is_finished = db.Column(db.Boolean, default=False)
    is_shared = db.Column(db.Boolean, default=False)
    is_public = db.Column(db.Boolean, default=False)
    task_related = db.Column(db.Integer, default=-1)

    create_time = db.Column(db.DateTime, index=True, default=datetime.now)
    progress = db.Column(db.Integer, default=0)
    name = db.Column(db.String(128), default='No name')
    introduction = db.Column(db.Text)

    # in public database
    db_create_time = db.Column(db.DateTime)
    liked = db.Column(db.Integer, default=0)
    favoriter = db.relationship('User', secondary=Favorite_circuit, backref=db.backref('circuit', lazy='dynamic')) 
    grade = db.Column(db.Text) # how ?

    def _copy_from_device(self, device_id):
        d = Device.query.get(device_id)
        if not d: raise Exception('No device #%d' % device_id) 
        d.update_from_db()

        self.introduction = self.introduction+' (COPYED: '+d.introduction+')'
        self.parts = d.parts
        self.relationship = d.relationship
        self.interfaceA = d.interfaceA
        self.interfaceB = d.interfaceB
        self.commit_to_db()

        return self



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


