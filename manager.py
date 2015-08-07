from server import create_app, db
from flask.ext.script import Manager, Shell, Command
#from flask.ext.migrate import Migrate, MigrateCommand

from server.models import User, Track, Message, Task, Comment, Memo
from server.models import Work, ComponentPrototype 

app = create_app('default')

manager = Manager(app)
#migrate = Migrate(app, db)

def make_shell_context():
    return dict(app=app, db=db, User=User, Track=Track,
            Message=Message, Task=Task, Comment=Comment, Memo=Memo) 

class Initialize(Command):
    def run(self):

        with app.app_context():
            # re-create the databse
            db.drop_all()
            db.create_all()

            # administrator
            u = User(username='Administrator', email='SYSU.Software2015@gmail.com', password='SYSU.Software')
            db.session.add(u)
            db.session.commit()

            # add empty component prototype
            c = ComponentPrototype(name='None', doc='This is the empty component', sequence='')
            db.session.add(c)
            db.session.commit()

            # default tracks
            from server.models import Track 
            t = Track(name='t1')
            db.session.add(t)
            db.session.commit()

            print 'Done.'

manager.add_command("shell", Shell(make_context=make_shell_context))
manager.add_command("init", Initialize())
#manager.add_command("db", MigrateCommand)

if __name__ == '__main__':
    manager.run()


