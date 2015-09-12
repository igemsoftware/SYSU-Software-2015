# -*- coding: utf-8 -*-

from .user import User
from .message import Message
from .task import Task 
from .comment import Comment, Answer, DesignComment
from .memo import Memo
from .track import Track
from .equation import Equation, EquationBase

from .synbio import ComponentPrototype, ComponentInstance, Relationship
from .synbio import Protocol, Device, Design, BioBase


model_list = [User, Track, Message, Task, Comment, Memo,
              ComponentPrototype, ComponentInstance, Relationship,
              Protocol, Device, Design, Answer, EquationBase,
              DesignComment]
manager_dict = dict(zip(map(lambda x: x.__name__, model_list), model_list))
