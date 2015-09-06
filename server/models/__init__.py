# -*- coding: utf-8 -*-

from .user import User
from .message import Message
from .task import Task 
from .comment import Comment
from .memo import Memo
from .track import Track
from .equation import Equation

from .synbio import ComponentPrototype, ComponentInstance, Relationship
from .synbio import Protocol, Device, Circuit, BioBase


model_list = [User, Track, Message, Task, Comment, Memo,
              ComponentPrototype, ComponentInstance, Relationship,
              Protocol, Device, Circuit]
manager_dict = dict(zip(map(lambda x: x.__name__, model_list), model_list))
