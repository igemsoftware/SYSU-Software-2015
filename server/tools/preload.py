# -*- coding: utf-8 -*-

from ..models import ComponentPrototype
from .. import db
import os
import codecs

def preload_parts(filename):
    print 'loading parts from %s' % filename
    with codecs.open(filename, 'r', 'gb2312') as f:
        for line in f:
            if len(line.strip(' \n\r').split('\t')) != 5:
                #raise Exception('Format error (No extra empty line after the table).')
                print('Warning: Format error. Skip line [%s].'%line.strip(' \n\r'))
            name, type, BBa, risk, bacterium = map(lambda x: x, line.strip(' \n\r').split('\t') )
            try:
                risk=int(risk)
            except:
                risk=-1

            if len(ComponentPrototype.query.filter_by(name=name, BBa=BBa).all()) == 0:
                c = ComponentPrototype(name=name, type=type, BBa=BBa, risk=risk, bacterium=bacterium)
                db.session.add(c)
#                print 'adding <name=%s, BBa=%s>' % (name, BBa)

    db.session.commit()


def get_file_list(path):
    l = []
    for dirpath, dirnames, filenames in os.walk(path):
        for f in filenames:
            l.append(os.path.join(dirpath,f))
    return l

