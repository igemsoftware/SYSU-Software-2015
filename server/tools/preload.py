from ..models import ComponentPrototype
from .. import db

def preload_parts(filename):
    with open(filename, 'r') as f:
        for line in f:
            if len(line.strip(' \n').split('\t')) != 5:
                #raise Exception('Format error (No extra empty line after the table).')
                print('Warning: Format error. Skip line [%s].'%line.strip(' \n'))
            name, type, BBa, risk, bacterium = line.strip(' \n').split('\t')  
            try:
                risk=int(risk)
            except:
                risk=-1
            c = ComponentPrototype(name=name, type=type, BBa=BBa,\
                    risk=risk, bacterium=bacterium)
            db.session.add(c)
    db.session.commit()
