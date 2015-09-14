# -*- coding: utf-8 -*-

from server import create_app, db
from flask.ext.script import Manager, Shell, Command
#from flask.ext.migrate import Migrate, MigrateCommand

from server.models import * 
from server.tools.preload import preload_parts, get_file_list
from server.tools.random_text import random_text

app = create_app('development')

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
        c = ComponentPrototype(name='None', introduction='This is the empty component')
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
def testinit(slient=False, noinit=False, quickcheck=False, Skipbio=False):
    if not noinit: init(slient)
    with app.app_context():
        if not slient: print bcolors.HEADER+'Adding test components ...',
        # useless
        # db.engine.raw_connection().connection.text_factory = 'utf8'

        # our bravery user 
        u = User(username='test', email='test@example.com', password='test', send_email=False)
        u.tracks.append(Track.query.first())
        db.session.add(u)

        if not Skipbio:
            # add default protocols 
            for dir in app.config.get('INIT_PRELOAD_PROTOCOL_DIRS', []):
                for filename in get_file_list(dir):
                    protocol = Protocol().load_from_file(filename)

            # add testing parts
            for dir in app.config.get('INIT_PRELOAD_PART_DIRS', []):
                for filename in get_file_list(dir):
                    preload_parts(filename)

            # add testing component prototype
            for dir in app.config.get('INIT_PRELOAD_DEVICE_DIRS', []):
                for filename in get_file_list(dir):
                    device = Device().load_from_file(filename)

#           for dir in app.config.get('INIT_PRELOAD_NEW_DEVICE_DIRS', []):
#               for filename in get_file_list(dir):
#                   device = Device().new_load_from_file(filename)

            # add testing equations 
            for dir in app.config.get('INIT_PRELOAD_EQUATION_DIRS', []):
                for filename in get_file_list(dir):
                    EquationBase.preload_from_file(filename)
            if quickcheck: return

        

#           Relationship.query.all()[0].equation = u'{"content": "\\\\frac{ {{a}}+[APTX4869] }{ {{b}}+[IQ] }=c", "parameters": {"a": 0.1, "b": "asdf"}}' 
#           Relationship.query.all()[1].equation = u'{"content": "\\\\frac{ d([Pcl]) }{ dt } = {{alpha}} * [Pcl] + {{beta}}", "parameters": {"alpha": 0.1, "beta": "K_1"}}'

            # designs 
            c = Design(name='My first design', brief_description='First design', owner=u, is_shared=True)._copy_from_device(1)
            c = Design(name='My second design', brief_description='Second design', owner=u, is_public=True)._copy_from_device(1)
            c = Design(name='My third design', brief_description='3rd design', owner=u)._copy_from_device(2)
            c = Design(name='My third design', brief_description='3rd design', owner=u)._copy_from_device(2)
            d = DesignComment(content='good design')
            d.owner = u
            d.design = c
            db.session.add(d)
            
            from numpy import random
            for i in range(50):
                is_finished = random.randint(2) == 1
                is_shared = is_finished and random.randint(2) == 1
                is_public = is_shared and random.randint(2) == 1
                used = random.randint(100) if is_public else 0
                c = Design(name=random_text(2).capitalize()+'design', 
                        brief_description = random_text(4),
                        full_description = random_text(100),
                        references = random_text(4),

                        rate = random.randint(1, 100),
                        eval_efficiency = random.randint(1, 100),
                        eval_reliability = random.randint(1, 100),
                        eval_accessibility = random.randint(1, 100),
                        eval_compatibility = random.randint(1, 100),
                        eval_demand = random.randint(1, 100),
                        eval_safety = random.randint(1, 100),
                        eval_completeness = random.randint(1, 100),

                        progress = random.randint(1, 100),
                        likes = random.randint(1, 100),

                        is_finished = is_finished,
                        is_shared = is_shared,
                        is_public = is_public,
                        used = used,

                        owner=u)._copy_from_device(1)

            admin = User.query.first()
            c = Design(name='My first design', brief_description='First design', owner=admin, is_public=True)._copy_from_device(1)
            u.favorite_designs.append(c)

        # memo
        u = User.query.filter_by(username='test').first()
        from datetime import datetime, timedelta
        m = u.add_memo(title='Sleep', content='I want to sleep', time_scale=60*8)
        m.change_plan_time(datetime.now() + timedelta(minutes=60*2))
        u.add_memo(title='Sleep', content='I want to sleep', time_scale=60*8)
        m.change_plan_time(datetime.strptime('15-08-08 08-08-08', '%y-%m-%d %H-%M-%S'))

        # task
        u = User.query.filter_by(username='test').first()
        t = u.create_task(title='Hidden features of Python',
                content='What are the lesser-known but useful features of the Python programming language?',
                votes=23, views=12)
        u.create_task(title='What IDE to use for Python?',
                content='What IDEs ("GUIs/editors") do others use for Python coding?',
                votes=12, views=24) 
        u.create_task(title='What is the name of the "-->" operator in C?',
                content='int x = 10;\n while (x --> 0) {\\\\ x count down to 0\n \\\\foo\n}',
                votes=20, views=19) 
        admin = User.query.first()
        a1 = u.answer_a_task(t, "haha, I don't know.")
        a2 = admin.answer_a_task(t, "haha, I don't know too.")
        u.comment_an_answer(a2, "be serious.")

        # message
        u = User.query.filter_by(username='test').first()
        for m in [Message(content='Warning, we have 21 days left.', source="Experiment Reminders"),
                  Message(content='Today is 2015.08.28.', source="Experiment Records"),
                  Message(content='Your database is empty.', source="Database"),
                  Message(content='via Taskhall', source='Taskhall')]:
            u.msg_box.append(m)
            db.session.add(m)

        
        print bcolors.OKGREEN+'OK'+'\nTestinit done.'+bcolors.ENDC

if __name__ == '__main__':
    manager.run()


