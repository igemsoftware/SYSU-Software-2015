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
            # re-create the database
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

            # add upload file directory
            import os
            if not os.path.isdir(app.config['UPLOAD_FOLDER_FULL']):
                os.makedirs(app.config['UPLOAD_FOLDER_FULL'])
            


            # default tracks
            from server.models import Track 
            track_names = ['artanddesign', 'communitylabs', 'energy', 'environment',
                    'foodandnutrition', 'foundationaladvance', 'healthandmedicine',
                    'informationprocessing', 'manufacturing', 'measurement',
                    'newapplication', 'policyandpractices', 'software']
            track_descriptions = ['Art & Design', 'Community Labs', 'Energy', 'Environment',
                    'Food & Nutrition', 'Foundational Advance', 'Health & Medicine',
                    'Information Processing', 'Manufacturing', 'Measurement',
                    'New Application', 'Policy & Practices', 'Software']
            for n, d in zip(track_names, track_descriptions):
                db.session.add(Track(name=n, description=d))
            db.session.commit()

            print 'Done.'

manager.add_command("shell", Shell(make_context=make_shell_context))
manager.add_command("init", Initialize())
#manager.add_command("db", MigrateCommand)

if __name__ == '__main__':
    manager.run()


