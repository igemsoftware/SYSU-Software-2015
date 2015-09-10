# -*- coding: utf-8 -*-

import json
from HTMLParser import HTMLParser

def json_parser(o, unpack=[]):
    o = json.loads(json.dumps(o.__dict__, default=repr))
    for ele in unpack:
        o[ele] = json.loads(o[ele])
    return o

def htmltotext(html):
    class Stripper(HTMLParser):
        def __init__(self):
            self.reset()
            self.fed = []
        def handle_data(self, d):
            self.fed.append(d)
        def get_data(self):
            nonspace = map(unicode.strip, self.fed)
            nonempty = filter(None, nonspace)
            return '<br/>'.join(nonempty)
    s = Stripper()
    s.feed(html)
    return s.get_data()

