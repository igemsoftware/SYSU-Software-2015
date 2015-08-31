# -*- coding: utf-8 -*-

from ..models import ComponentPrototype
from .. import db
import os

def preload_parts(filename):
    print 'loading parts from %s' % filename
    with open(filename, 'r') as f:
        for line in f:
            if len(line.strip(' \n').split('\t')) != 5:
                #raise Exception('Format error (No extra empty line after the table).')
                print('Warning: Format error. Skip line [%s].'%line.strip(' \n'))
            name, type, BBa, risk, bacterium = map(lambda x: x.decode('ISO-8859-1'), line.strip(' \n').split('\t') )
            try:
                risk=int(risk)
            except:
                risk=-1
            c = ComponentPrototype(name=name, type=type, BBa=BBa,\
                    risk=risk, bacterium=bacterium)
#            print 'adding <name=%s>' % name
            db.session.add(c)
    db.session.commit()


def get_file_list(path):
    l = []
    for dirpath, dirnames, filenames in os.walk(path):
        for f in filenames:
            l.append(os.path.join(dirpath,f))
    return l

