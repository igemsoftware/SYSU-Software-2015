from server import create_app, db
from flask.ext.script import Manager, Shell, Command
#from flask.ext.migrate import Migrate, MigrateCommand

from server.models import * 

app = create_app('default')

manager = Manager(app)
def make_shell_context():
    return dict(app=app, db=db, **manager_dict)
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
def testinit(slient=False, noinit=False):
    if not noinit: init(slient)
    with app.app_context():
        if not slient: print bcolors.HEADER+'Adding test components ...',

        # add testing component prototype
        if app.config.has_key('INIT_PRELOAD_WORKS'):
            for filename in app.config['INIT_PRELOAD_WORKS']:
                w = Work().load_from_file(filename)

        print bcolors.OKGREEN+'OK'+'\nTestinit done.'+bcolors.ENDC


if __name__ == '__main__':
    manager.run()


