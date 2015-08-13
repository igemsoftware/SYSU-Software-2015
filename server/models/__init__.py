from .user import User
from .message import Message
from .task import Task 
from .comment import Comment
from .memo import Memo
from .track import Track

from .function import ComponentPrototype, ComponentInstance, Relationship
from .function import Protocol, Device, Circuit 


model_list = [User, Track, Message, Task, Comment, Memo,
              ComponentPrototype, ComponentInstance, Relationship,
              Protocol, Device, Circuit]
manager_dict = dict(zip(map(lambda x: x.__name__, model_list), model_list))
