from server import create_app, db
from flask.ext.script import Manager, Shell
#from flask.ext.migrate import Migrate, MigrateCommand

from server.models import User, Track, Message, Task, Comment, Memo

app = create_app('default')

manager = Manager(app)
#migrate = Migrate(app, db)

def make_shell_context():
    return dict(app=app, db=db, User=User, Track=Track,
            Message=Message, Task=Task, Comment=Comment, Memo=Memo) 

manager.add_command("shell", Shell(make_context=make_shell_context))
#manager.add_command("db", MigrateCommand)

if __name__ == '__main__':
    manager.run()

