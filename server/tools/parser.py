# -*- coding: utf-8 -*-

import json 

def json_parser(o, unpack=[]):
    o = json.loads(json.dumps(o.__dict__, default=repr))
    for ele in unpack:
        o[ele] = json.loads(o[ele])
    return o
