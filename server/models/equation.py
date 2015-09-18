# -*- coding: utf-8 -*-

import json

class Equation():
    """Equation model in CORE. We use json to express an equation.

    e.g. 

    .. code-block:: json

        {
            'content':'\\frac{ {{a}}+[APTX4869] }{ {{b}}+[IQ] }=c',
            'parameter': 
                { 
                    'a': 0.1,
                    'b': 0.2 
                }
        }

    is equivalent to :math:`\\frac{ 0.1+[APTX4869]}{ 0.2+[IQ] }=c`
    """

    parameters = {}
    """Parameters in the eqaution. It's a python dict. 
    Parameter is in {{<parameter name>}} format in :attr:`content`."""
    content = '' 
    """The raw text of json object"""

    def __init__(self, parameters={}, content='', jsonstr=''):
        """Create with empty equation or start with a dumpped json string."""
        self.parameters = parameters 
        self.content = content

        if jsonstr:
            jsonobj = json.loads(jsonstr)
            self.parameters = jsonobj.get('parameters', {})
            self.content = jsonobj.get('content', '')

    def render(self):
        """Render the equation with :attr:`parameters`."""
        res = self.content
        for p, v in self.parameters.iteritems():
            res = res.replace('{{'+p+'}}', str(v))
        return res

# javascript
# function render(e) { 
#       var res = e.content;  
#       for (var key in e.parameters) 
#       res=res.replace('{{'+key+'}}', e.parameters[key]); 
#       return res; 
# }

    def json_dumps(self):
        return json.dumps({ 
                 'content': self.content,
                 'parameters': self.parameters
               })
    
    def __repr__(self):
        return self.render()

    def jsonify(self):
        return {'content': self.content,
                'parameters': self.parameters}


import traceback
from .. import db 
from synbio import ComponentPrototype
                   
from ..tools.simulation.release import getModel, name_handler

class EquationBase(db.Model):
    """EquationBase model in CORE.""" 
   
#   target = db.Column(db.Text)
#   related = db.Column(db.Text, default='[]')
#   parameter = db.Column(db.Text, default='[]')

    id = db.Column(db.Integer, primary_key=True)
    """ID is an unique number to identify each :class:`Memo`."""
    related_count = db.Column(db.Integer, default=0, index=True)
    """How many components related to it."""
    _content = db.Column(db.Text, default = '{}') 
    """Raw content in database."""
    printable = db.Column(db.Text, default = '')
    """Printable formular in Tex."""
    content = {}
    """Its content object."""

    def __repr__(self):
        self.update_from_db()
        return '<EquationBase[%d] %r>' % (self.id, self.packed())

    def commit_to_db(self):
        """Encode things into :attr:`_content` ."""
        self._content = json.dumps(self.content)
        self.related_count = len(self.content.get('related', [])) + 1
        db.session.add(self)
        return self

    def update_from_db(self):
        """Decode things from :attr:`_content` ."""
        self.content = json.loads(self._content)
        return self

    @property
    def target(self):
        """The target variable in differential equation."""
        return self.content.get('target', '')

    @property
    def related(self):
        """Other related variables in differential equation."""
        return self.content.get('related', [])

    @property
    def all_related(self):
        """All related variables in differential equation."""
        return set([self.target]+self.related)

    @property
    def parameter(self):
        """The parameters in differential equation."""
        return self.content.get('parameter', {})

    @property
    def formular(self):
        """The differential equation itself."""
        return self.content.get('formular', '')

    def packed(self):
        """Pack things together."""
        self.update_from_db()
        return [self.target, self.related, self.parameter, self.formular]

    @target.setter
    def target(self, value):
        self.content['target'] = value

    @related.setter
    def related(self, value):
        self.content['related'] = value

    @parameter.setter
    def parameter(self, value):
        self.content['parameter'] = value

    @formular.setter
    def formular(self, value):
        self.content['formular'] = value


    def render(self):
        self.update_from_db()
        return Equation(parameters=self.parameter, content=self.formular).render()


    @staticmethod
    def preload_from_str(line):
        ele = eval(line, {'__builtins__':None}, {})
        e = EquationBase()

        for attr in [ele[0]]+ele[1]:
            c = ComponentPrototype.query.filter_by(attr=attr).first()
            if c==None:
                print(">>>>>>>%s does not exist<<<<<<" % attr)
                #raise Exception("%s not exist" % attr)

        e.target = name_handler(ele[0])
        e.related = map(lambda x: name_handler(x), ele[1])
        e.parameter = dict(ele[2])
        e.formular = ele[3]

        for coe, value in e.parameter.iteritems():
            e.parameter[coe] = float(value)
            
            # tranlate coe to var
            c = ComponentPrototype.query.filter_by(attr=coe).first()
            if c:
                c.initval = float(value)
                e.formular = e.formular.replace('{{'+coe+'}}', coe)
                ele[1].append(coe)
                e.related.append(name_handler(coe))

        # name handler
        para = [ele[0]]+ele[1]
        para.sort(key=len, reverse=True)
        for var in para:
            newvar = name_handler(var)
            e.formular = e.formular.replace(var, newvar)

        e.commit_to_db()

        return e

    @staticmethod
    def preload_from_file(filename):
        print 'loading equation from %s ...' % filename
        if filename.split('.')[-1] not in ['txt', 'py']: 
            print '\tSkip', filename
            return  
        system = []
        with open(filename, 'r') as f:
            for line in f:
                line = line.strip().split('#')[0]
                if not line or line.startswith('#'): continue

                try:
                    e = EquationBase.preload_from_str(line)
                except Exception, exp:
                    msg = traceback.format_exc()
                    print msg
                    raise Exception
                    return msg

                system.append(e.packed())

        model, msg, names = getModel(system)
        if model:
            print 'Success'
            return 'success'
        else:
            return msg



