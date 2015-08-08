from server import create_app, db
from flask.ext.script import Manager, Shell, Command
#from flask.ext.migrate import Migrate, MigrateCommand

from server.models import User, Track, Message, Task, Comment, Memo
from server.models import Work, ComponentPrototype 

app = create_app('default')

manager = Manager(app)
def make_shell_context():
    return dict(app=app, db=db, User=User, Track=Track,
            Message=Message, Task=Task, Comment=Comment, Memo=Memo) 
manager.add_command("shell", Shell(make_context=make_shell_context))

#migrate = Migrate(app, db)
#manager.add_command("db", MigrateCommand)

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

@manager.command
def init(slient=False):
    with app.app_context():
        # re-create the database
        if not slient: print bcolors.HEADER+'Destroying previous database ...',
        db.drop_all()
        if not slient: print bcolors.OKGREEN+'OK'+bcolors.HEADER+'\nCreating empty database ...',
        db.create_all()

        # administrator
        if not slient: print bcolors.OKGREEN+'OK'+bcolors.HEADER+'\nCreating Administrator ...',
        u = User(username='Administrator', email='SYSU.Software2015@gmail.com', password='SYSU.Software')
        db.session.add(u)
        db.session.commit()

        # add empty component prototype
        if not slient: print bcolors.OKGREEN+'OK'+bcolors.HEADER+'\nCreating None prototype ...',
        c = ComponentPrototype(name='None', doc='This is the empty component', sequence='')
        db.session.add(c)
        db.session.commit()

        # add upload file directory
        if not slient: print bcolors.OKGREEN+'OK'+bcolors.HEADER+'\nCreating upload file directory ...',
        import os
        if not os.path.isdir(app.config['UPLOAD_FOLDER_FULL']):
            os.makedirs(app.config['UPLOAD_FOLDER_FULL'])
        
        # default tracks
        if not slient: print bcolors.OKGREEN+'OK'+bcolors.HEADER+'\nCreating default tracks ...',
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

        print bcolors.OKGREEN+'OK'+'\nInit done.'+bcolors.ENDC

@manager.command
def testinit(slient=False):
    init(slient)
    with app.app_context():
        if not slient: print bcolors.HEADER+'Adding test components ...',
        # add testing component prototype
        c = ComponentPrototype(name='Gene 1', doc='This is test part no. 1', sequence='ATCG')
        db.session.add(c)
        db.session.commit()
        c = ComponentPrototype(name='Gene 2', doc='This is test part no. 2', sequence='')
        db.session.add(c)
        db.session.commit()

        w = Work(title='test', log='asdf')
        w.commit_to_db() # use this method to commit

        w.add_component_by_id(2, alias='part 1 (gene 1)')
        w.add_component_by_id(2, alias='part 2 (gene 1)')
        w.add_component_by_id(3, alias='part 3 (gene 2)')
        w.add_connection(1, 2, 'promote')

        w.commit_to_db() # use this method to commit
        w.update_from_db() # use this method to get

        print bcolors.OKGREEN+'OK'+'\nTestinit done.'+bcolors.ENDC


if __name__ == '__main__':
    manager.run()


