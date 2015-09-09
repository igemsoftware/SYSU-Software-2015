"""
    A simplified version of models.Equation
"""
class Equation():
    def __init__(self, parameters={}, content=''):
        self.parameters = parameters
        self.content = content 

    def render(self):
        res = self.content
        for p, v in self.parameters.iteritems():
            res = res.replace('{{'+p+'}}', str(v))
        return res

