from config import config

from flask import Flask
#from flask.ext.bootstrap import Bootstrap
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager

db = SQLAlchemy()
login_manager = LoginManager()
login_manager.session_protection = 'strong'
#login_manager.login_view = 'auth.login'
#bootstrap = Bootstrap()

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    db.init_app(app)
#    bootstrap.init_app(app)
    login_manager.init_app(app)

    from .routes import main as main_blueprint
    app.register_blueprint(main_blueprint)

    from .routes import auth as auth_blueprint
    app.register_blueprint(auth_blueprint, url_prefix='/auth')

    return app
