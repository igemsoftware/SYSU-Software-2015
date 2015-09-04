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

