from .user import User
from .message import Message
from .task import Task 
from .comment import Comment
from .memo import Memo
from .track import Track

from .function import Work, ComponentPrototype, ComponentInstance, Relationship


model_list = [User, Track, Message, Task, Comment, Memo,
              Work, ComponentPrototype, ComponentInstance, Relationship]
manager_dict = dict(zip(map(lambda x: x.__name__, model_list), model_list))
