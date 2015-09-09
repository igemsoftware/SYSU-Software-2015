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

    def __init__(self, jsonstr=None):
        """Create with empty equation or start with a dumpped json string."""
        self.parameters = {} 
        self.content = ''

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


from .. import db 

class EquationBase(db.Model):
    """Equation in Database""" 
   
#   target = db.Column(db.Text)
#   related = db.Column(db.Text, default='[]')
#   parameter = db.Column(db.Text, default='[]')

    id = db.Column(db.Integer, primary_key=True)
    related_count = db.Column(db.Integer, default=0, index=True)
    _content = db.Column(db.Text, default = '{}') 
    printable = db.Column(db.Text, default = '')
    content = {}

    def __repr__(self):
        return '<EquationBase[%d] #%d: %s>' % (self.id, self.related_count, self.formular)

    def commit_to_db(self):
        self._content = json.dumps(self.content)
        self.related_count = len(self.content.get('related', [])) + 1
        db.session.add(self)

    def update_from_db(self):
        self.content = json.loads(self._content)

    @property
    def target(self):
        return self.content.get('target', '')

    @property
    def related(self):
        return self.content.get('related', [])

    @property
    def all_related(self):
        return set([self.target]+self.related)

    @property
    def parameter(self):
        return self.content.get('parameter', {})

    @property
    def formular(self):
        return self.content.get('formular', '')

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

    @staticmethod
    def preload_from_file(filename):
        with open(filename, 'r') as f:
            for line in f:
                line = line.strip()
                if not line: continue

                ele = eval(line, {'__builtins__':None}, {})
                e = EquationBase()
                e.target = ele[0]
                e.related = ele[1]
                e.parameter = dict(ele[2])
                e.formular = ele[3]
                e.commit_to_db()


