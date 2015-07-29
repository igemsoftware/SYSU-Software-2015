import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = "Hieveryone" 

    SQLALCHEMY_COMMIT_ON_TEARDOWN = True
    SQLALCHEMY_RECORD_QUERIES = True
    #FLASKY_SLOW_DB_QUERY_TIME=0.5

#   MAIL_SERVER = 'smtp.googlemail.com'
#   MAIL_PORT = 587
#   MAIL_USE_TLS = True
#   MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
#   MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
#   FLASKY_MAIL_SUBJECT_PREFIX = '[sysu-software]'
#   FLASKY_MAIL_SENDER = 'sysu-software admin<sysu-software@example.com>'

    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    DEBUG = True
#    SQLALCHEMY_DATABASE_URI = "mysql://"

class ProductionConfig(Config):
    DEBUG = False 
#    SQLALCHEMY_DATABASE_URI = "mysql://"

class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:////tmp/test.db"

#   mail-bug-logging
#   @classmethod
#   def init_app(cls, app):
#       Config.init_app(app)

#       # email errors to the administrators
#       import logging
#       from logging.handlers import SMTPHandler
#       credentials = None
#       secure = None
#       if getattr(cls, 'MAIL_USERNAME', None) is not None:
#           credentials = (cls.MAIL_USERNAME, cls.MAIL_PASSWORD)
#           if getattr(cls, 'MAIL_USE_TLS', None):
#               secure = ()
#       mail_handler = SMTPHandler(
#           mailhost=(cls.MAIL_SERVER, cls.MAIL_PORT),
#           fromaddr=cls.FLASKY_MAIL_SENDER,
#           toaddrs=[cls.FLASKY_ADMIN],
#           subject=cls.FLASKY_MAIL_SUBJECT_PREFIX + ' Application Error',
#           credentials=credentials,
#           secure=secure)
#       mail_handler.setLevel(logging.ERROR)
#       app.logger.addHandler(mail_handler)

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,

    'default': DevelopmentConfig
}

