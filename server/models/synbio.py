# -*- coding: utf-8 -*-

from .. import db
import json


#   class ProtocolRecommend(db.Model):
#       protocol_id = db.Column(db.Integer, db.ForeignKey('protocol.id'),
#                               primary_key=True)
#       device_id = db.Column(db.Integer, db.ForeignKey('device.id'),
#                               primary_key=True)

#       def __repr__(self):
#           return '<ProtocolRecommend: %s->%s>' % (self.prototype.name, self.device.name)

class Protocol(db.Model):
    """Protocol model in CORE."""

    id = db.Column(db.Integer, primary_key=True)
    """ID is an unique number to identify each :class:`Protocol`."""

    name = db.Column(db.String(128), default='', index=True)
    """Its name, which is used to sort."""
    introduction = db.Column(db.Text, default='')
    """Its introduction."""
    component = db.Column(db.Text, default='')
    """Its component, which is a list of strings."""
    procedure = db.Column(db.Text, default='')
    """Its procedure, which is the dumpped string of a list of json object:
        
    :procedure: The detailed step.
    :time: How long this step takes.
    :annotation: Annotation."""
    likes = db.Column(db.Integer, default=0)
    """How many user like this protocol."""
    setB = db.Column(db.Boolean, default=False)
    """Whether it is in setB. SetB is the general operation mannual."""

    recommend = db.Column(db.Boolean, default = False)
    """The recommended protocol will added in design by default."""

#    liked = db.Column(db.Integer, default=0)
#    used_times = db.Column(db.Integer, default=0)

    def jsonify(self):
        """Tranform itself into a json object."""
        procedures = []
        for steps in self.procedure.split('\n'):
            steps = steps.split('\t')
            if len(steps) == 2:
                procedures.append({'procedure':steps[0],'time':steps[1],'annotation':''})
            elif len(steps) == 3:
                procedures.append({'procedure':steps[0],'time':steps[1],'annotation':steps[2]})

        return {
                    'id': self.id,
                    'name': self.name,
                    'introduction': self.introduction,
                    'component': self.component.split('\n'),
                    'procedure' : procedures,
                    'likes': self.likes,
                    'setB': self.setB,
               }


    def load_from_file(self, filename):
        """Load from local files. Mostly called in preload stage."""
        print 'loading protocol %s ...' % filename
        _introduction = []
        _component = []
        _procedure = []
        import codecs
        with codecs.open(filename, 'r', 'ISO-8859-1') as f:
            self.name = f.readline().strip()
            if self.name[0] == 'B': self.setB = True;
#            self.recommend = f.readline().strip() == 'True'
            self.recommend = True
            for line in f:
                line = line.strip()
                if line == 'Introduction':
                    ptr = _introduction
                elif line == 'Components':
                    ptr = _component
                elif line == 'Procedure' or line.startswith('Procedure'):
                    ptr = _procedure
                else:
                    ptr.append(line.strip())

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


from equation import Equation

class Relationship(db.Model):
    """Relationship between parts in CORE."""

    start_id = db.Column(db.Integer, db.ForeignKey('componentprototype.id'),
                            primary_key=True)
    """The :attr:`User.id` of the start point of the relationship."""
    end_id = db.Column(db.Integer, db.ForeignKey('componentprototype.id'),
                            primary_key=True)
    """The :attr:`User.id` of the end point of the relationship."""
    type = db.Column(db.String(64), default='normal')
    """Three kinds of relationship between two parts:
        
    :normal: The sequential relationship.
    :promotion: The existence of starter will promote production of the ender.
    :inhibition: The existence of starter will inhibit production of the ender."""

    @property
    def equation(self):
        """A :class:`Equation` instance to describe the relationship"""
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
        return '<Relationship: %s->%s %s>' % (self.start.attr, self.end.attr, self.type)


class ComponentPrototype(db.Model):
    """ComponentPrototype is the prototype of biological/chemical/other components."""

    __tablename__ = 'componentprototype'
    id = db.Column(db.Integer, primary_key=True)
    """ID is an unique number to identify each :class:`ComponentPrototype`."""

    name = db.Column(db.String) #unique=True)
    """Its name."""

    type = db.Column(db.String(64), default='None')
    """There many type of components.
    
    :None: The default 'empty' type.
    :Promoter: The promotor part on gene.
    :RBS: The RBS part on gene.
    :gene: The CDS part on gene.
    :terminator: The terminator part on gene.
    :material: Physical material.
    :protein: Protein.
    :unknonw: Un-catagory."""
    introduction = db.Column(db.Text, default="No introduction yet.")
    """Its introduction."""
    source = db.Column(db.Text, default="Come from no where.")
    """From where this component is collected."""
    risk = db.Column(db.Integer, default="-1")
    """Biological risk."""
    BBa = db.Column(db.String, default='')
    """BBa number, if existed."""
    bacterium = db.Column(db.String, default='')
    """From what kind of bacterium this component is collected."""
    
    point_to = db.relationship('Relationship', 
                               foreign_keys=[Relationship.start_id],
                               backref=db.backref('start', lazy='joined'),
                               lazy='dynamic',
                               cascade='all, delete-orphan')
    """What components does it point to."""
    be_point = db.relationship('Relationship', 
                               foreign_keys=[Relationship.end_id],
                               backref=db.backref('end', lazy='joined'),
                               lazy='dynamic',
                               cascade='all, delete-orphan')
    """What components points to it."""

    @property
    def attr(self):
        """Combine :attr:`BBa` with :attr:`name`, if :attr:`BBa` exists."""
        if self.name in ['Promoter', 'RBS', 'Terminator'] and self.BBa:
            return self.name+':'+self.BBa
        else:
            return self.name

    def __repr__(self):
        return '<ComponentPrototype: %s>' % self.name

# jingjin's Model
class ComponentInstance():
    """ComponentInstance is an instance of :class:`ComponentPrototype` in every :class:`BioBase`. """

    partAttr = ''
    """Unique attribution (mixed with BBa) for a prototype."""
    partName = ''
    """The name of the prototype."""
    positionX = 0.
    """The position on X-axis."""
    positionY = 0.
    """The position on Y-axis."""
    def __init__(self, partName, partID=None, partAttr=None, BBa=None, positionX=300., positionY=300.):
        """Initialization constructor, can use :attr:`ComponentPrototype.name` 
        or :attr:`ComponentPrototype.attr` to find the prototype."""
#        print "New instance: BBa: %s, pname: %s" % (BBa, partName)
        if partName in ['Promoter', 'RBS', 'Terminator'] and not BBa:
            BBa = ''
        if BBa != None:
            c = ComponentPrototype.query.filter_by(name=partName, BBa=BBa).first()
        else:
            c = ComponentPrototype.query.filter_by(name=partName).first()
        if c is None:
            raise Exception ('No prototype named %s BBa %s' % (partName, BBa) )
            partID = partName = 'None'
            c = ComponentPrototype.query.filter_by(name=partName).first()

        self.partID = partID if partID else partName 
        self.partName = partName 
        self.partAttr = partAttr if partAttr else c.attr
        self.positionX = positionX
        self.positionY = positionY

    def __getitem__(self, key):
        if hasattr(self, key):
            return getattr(self, key)

    def jsonify(self):
        """Tranform itself into a json object."""
        return {
                    'partID': self.partID,
                    'partName': self.partName,
                    'positionX': self.positionX,
                    'positionY': self.positionY,
                    'partAttr': self.partAttr
               }

    def __repr__(self):
        return repr(self.jsonify())


class BioBase():
    """A base class for :class:`Device` and :class:`Design`."""
    content = db.Column(db.Text)
    """String of a dumpped json object."""

    parts = []
    """List of :class:`ComponentInstance`"""
    relationship = []
    """List of :class:`Relationship`"""
    interfaceA = ''
    """The input of it."""
    interfaceB = ''
    """The output of it."""
    backbone = []
    """The backbone of it."""

    def __init__(self):
        self.parts = []
        self.relationship = []
        self.interfaceA = ''
        self.interfaceB = ''
        self.backbone = []

    def update_from_db(self):
        """Update :attr:`parts`, :attr:`relationship`, 
        :attr:`interfaceA`, and :attr:`interfaceB` from database"""
        #print self.connections
        json_obj = json.loads(self.content)
        self.parts = map(lambda x: ComponentInstance(**x), json_obj['parts'])
        self.relationship = json_obj['relationship'] 
        self.interfaceA = json_obj['interfaceA']
        self.interfaceB = json_obj['interfaceB']
        self.backbone = json_obj['backbone']
        
    def commit_to_db(self):
        """Pack :attr:`parts`, :attr:`relationship`, 
        :attr:`interfaceA`, and :attr:`interfaceB` and commit to database."""
#        print self.connections
        if self.parts:
            if isinstance(self.parts[0], dict):
                json_parts = self.parts
            else:
                json_parts = map(lambda x: x.jsonify(), self.parts)
        else:
            json_parts = self.parts
        json_obj = {
                        'parts': json_parts,
                        'relationship': self.relationship,
                        'interfaceA': self.interfaceA,
                        'interfaceB': self.interfaceB,
                        'backbone': self.backbone,
                   }
        self.content = json.dumps(json_obj)

        db.session.add(self)
        db.session.commit()


    def clear(self):
        """Pack :attr:`parts`, :attr:`relationship`, 
        :attr:`interfaceA`, and :attr:`interfaceB` and commit to database."""
        self.components = []
        self.connections = []

    # The following method is useless
    # Those operations are done in front-end
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

    def add_component_by_name_and_BBa(self, component_name, BBa, **kwargs):
        c = ComponentInstance(partName=component_name, BBa=BBa, **kwargs)
        self.parts.append(c)
        return c



    def add_connection(self, x, y, r):
        self.relationship.append({'start':x, 'end':y, 'type':r})

    # how to select a component? 
    def del_component(self, local_id):
        self.relationship.remove(local_id)

class Device(db.Model, BioBase):
    id = db.Column(db.Integer, primary_key=True)
    """ID is an unique number to identify each :class:`Device`."""

    name = db.Column(db.String(32))
    """Its name."""

    brief_description = db.Column(db.Text, default="")
    """Brief description."""
    full_description = db.Column(db.Text, default="")
    """Full description."""
    keyword = db.Column(db.Text, default="")
    """Keyword"""

    source = db.Column(db.Text, default="Come from no where.")
    """Its source."""
    protocol_reference = db.Column(db.Text, default="No reference.")
    """Its protocol reference."""
    risk = db.Column(db.Integer, default="-1")
    """Its biological risk."""
    pic_url = db.Column(db.Text, default='')
    """Its picture url."""

##  recommended_protocol = db.relationship('ProtocolRecommend',
##                                 foreign_keys=[ProtocolRecommend.device_id],
##                                 backref=db.backref('device', lazy='joined'),
##                                 lazy='dynamic',
##                                 cascade='all, delete-orphan')

    def __init__(self, **kwargs):
        # super(Work, self).__init__(**kwargs)
        BioBase.__init__(self)

    # load from file
    def __load_prototype_and_instance(self, name, new_instance=True, skip_instance=False):
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
        if not BBa:
            BBa = ''

        # add Prototype if not exist
        if pname in ['Promoter', 'RBS', 'Terminator']:
            c = ComponentPrototype.query.filter_by(name=pname, BBa=BBa).first()
        else:
            c = ComponentPrototype.query.filter_by(name=pname).first()
        if c==None: 
            raise Exception('No prototype [name=%s, BBa=%s].'%(pname, BBa))
        if skip_instance:
            return c
        BBa = c.BBa

#           c = ComponentPrototype(name=pname, type=type)
#       db.session.add(c)
#       db.session.commit()

        # add component if not exist
        if new_instance:
            instance = self.add_component_by_name_and_BBa(pname, BBa, partID=name)
        else:
#            print map(lambda x: x.partAttr, self.parts)
            for ins in self.parts:
                if ins.partID==name:
                    instance = ins
                    break
        return c, instance

    def new_load_from_file(self, filename):
        """Load from local files. Mostly called in preload stage."""
        print 'loading device from %s ...' % filename
        if filename.split('.')[-1] != 'txt': 
            print '\tSkip', filename
            return  
        import codecs
        f = codecs.open(filename, 'r', 'gb2312')
        self.name= f.readline().strip()
        self.brief_description = f.readline().strip()
        self.full_description = f.readline().strip()
        self.keyword = f.readline().strip()
        #self.introduction = f.readline().strip().decode('ISO-8859-1')
        self.source = f.readline().strip()
        self.protocol_reference = f.readline().strip()
        try:
            self.risk = int(f.readline().strip())
        except:
            self.risk = -1
        # self.type = f.readline().strip()
        self.interfaceA = f.readline().strip() 
        self.interfaceB = f.readline().strip() #.split(',')

        json_obj = json.loads(f.readline().strip())

        d = Device()
        d.commit_to_db()
        d.update_from_db()

        for ele in ['relationship', 'parts',
                'name', 'interfaceA', 'interfaceB', 'backbone']:
            d.__setattr__(ele, json_obj[ele])

        d.commit_to_db()

        for ele in json_obj['relationship']:
#            if ele['type'] == 'normal': continue

            start = self.__load_prototype_and_instance(ele['start'], skip_instance=True)
            end = self.__load_prototype_and_instance(ele['end'], skip_instance=True)
        
            existed = Relationship.query.filter_by(start=start, end=end).first()
            if not existed:
                r = Relationship(start=start, end=end, type=ele['type'])
                db.session.add(r)
            elif existed.type == 'normal' and ele['type'] != 'normal':
                existed.type = ele['type']
                db.session.add(existed)






    def load_from_file(self, filename):
        """Load from local files. Mostly called in preload stage."""
        print 'loading device from %s ...' % filename
        if filename.split('.')[-1] != 'txt': 
            print '\tSkip', filename
            return  
        import codecs
        f = codecs.open(filename, 'r', 'gb2312')
        self.name= f.readline().strip()
        self.brief_description = f.readline().strip()
        self.full_description = f.readline().strip()
        self.keyword = f.readline().strip()
        #self.introduction = f.readline().strip().decode('ISO-8859-1')
        self.source = f.readline().strip()
        self.protocol_reference = f.readline().strip()
        try:
            self.risk = int(f.readline().strip())
        except:
            self.risk = -1
        # self.type = f.readline().strip()
        self.interfaceA = f.readline().strip() 
        self.interfaceB = f.readline().strip() #.split(',') 

        rec = set() 
        for line in f:
            line = line
            if len(line.strip(' \n\r').split('\t')) != 3:
                #raise Exception('Format error (No extra empty line after the table).')
#                print('Warning: Format error. Skip line [%s].'%line.strip(' \n'))
                continue
#            print '[%s]' % line
            print line.strip()
            A_name, B_name, R_type = line.strip(' \n\r').split('\t')

            #print line
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

Favorite_design = db.Table('favorite_design',
    db.Column('design_id', db.Integer, db.ForeignKey('design.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'))
)



class Design(db.Model, BioBase):
    """Design model in CORE."""
    id = db.Column(db.Integer, primary_key=True)
    """ID is an unique number to identify each :class:`Memo`."""
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id')) 
    """The :attr:`User.id` of owner."""

    name = db.Column(db.Text, default='')
    """Its name, which will be shown in calendar"""
    # as well as `name` here

    brief_description = db.Column(db.Text, default='')
    """Brief description."""
    full_description = db.Column(db.Text, default='')
    """Full description."""
#    graph
#    statistical chart
    references = db.Column(db.Text, default='')
    """References."""
    rate = db.Column(db.Integer, default = 0)
    """The integrated rate."""
    eval_efficiency = db.Column(db.Integer, default = 0)
    """Evaluation of efficiency."""
    eval_reliability = db.Column(db.Integer, default = 0)
    """Evaluation of reliability."""
    eval_accessibility = db.Column(db.Integer, default = 0)
    """Evaluation of accessibiliy."""
    eval_compatibility = db.Column(db.Integer, default = 0)
    """Evaluation of compatibility."""
    eval_demand = db.Column(db.Integer, default = 0)
    """Evaluation of demand."""
    eval_safety = db.Column(db.Integer, default = 0)
    """Evaluation of safety."""
    eval_completeness = db.Column(db.Integer, default = 0)
    """Evaluation of completeness."""
    last_active = db.Column(db.DateTime, default=datetime.now)
    """Last active time."""
    comments = db.relationship('DesignComment', backref='design', lazy='dynamic')
    """:class:`DesignComment` of it."""

    is_finished = db.Column(db.Boolean, default=False)
    """Whether the design is complete."""
    is_shared = db.Column(db.Boolean, default=False)
    """Whether the design is shared."""
    is_public = db.Column(db.Boolean, default=False)
    """Whether the design is public."""
    used = db.Column(db.Integer, default=0)
    """Used times."""
    # task_related = db.Column(db.Integer, default=-1)

    create_time = db.Column(db.DateTime, index=True, default=datetime.now)
    """When the design is created."""
    progress = db.Column(db.Integer, default=0)
    """The progress of the design."""

    protocols = db.Column(db.Text, default='')
    """The protocols it is using."""
    plasmids = db.Column(db.Text, default='[]')
    """Plasimid information"""
    img = db.Column(db.Text, default='')
    """Img in Base64"""
    risk = db.Column(db.Integer, default=-1)
    """Safety risk"""
    source = db.Column(db.String, default=-1)
    """Design source"""
    #experiment = db.Column(db.Text, default='')

    # in public database
    release_time = db.Column(db.DateTime, default=datetime.now)
    public_create_time = db.Column(db.DateTime, default=datetime.now)
    """When this design is in CORE Bank."""
    likes = db.Column(db.Integer, default=0)
    """How many likes it get."""
    favoriter = db.relationship('User', secondary=Favorite_design, backref=db.backref('fav_design', lazy='dynamic')) 
    """Who mark it as favorite."""

    def check_public(self):
        if self.is_shared:
            self.is_public = True
            self.public_create_time = datetime.now()


##  recommended_protocol = db.relationship('ProtocolRecommend',
##                                 foreign_keys=[ProtocolRecommend.device_id],
##                                 backref=db.backref('device', lazy='joined'),
##                                 lazy='dynamic',
##                                 cascade='all, delete-orphan')


    def __init__(self, **kwargs):
        super(Design, self).__init__(**kwargs)
        self.protocols = json.dumps([p.jsonify() for p in Protocol.query.filter_by(recommend=True, setB=False).all()])
                                 

    def _copy_from_device(self, device_id):
        """Copy from a device."""
        d = Device.query.get(device_id)
        if not d: raise Exception('No device #%d' % device_id) 
        d.update_from_db()

        self.full_description = self.full_description+' (COPYED: '+d.brief_description+')'
        self.parts = d.parts
        self.relationship = d.relationship
        self.interfaceA = d.interfaceA
        self.interfaceB = d.interfaceB
        self.commit_to_db()

        return self

    def jsonify(self):
        """Transform itself into a json object."""
        tags = []
        if self.is_shared: tags.append('Share')
        if self.is_public: tags.append('Public')
        #if self.task_related > 0: tags.append('Task')
        return {
            'id': self.id,
            'tags': tags,
            'progress': self.progress,
            'name': self.name,
            'description': self.full_description,
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

# some discussions

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
