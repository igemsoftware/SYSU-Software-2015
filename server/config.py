import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = "Hieveryone" 

    SQLALCHEMY_COMMIT_ON_TEARDOWN = True
    SQLALCHEMY_RECORD_QUERIES = True
    #FLASKY_SLOW_DB_QUERY_TIME=0.5

    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465 
    MAIL_USE_SSL = True
    MAIL_USERNAME = 'sysu.software2015@gmail.com'
    MAIL_PASSWORD = 'SYSU.Software2015@gmail' 
    FLASKY_MAIL_SUBJECT_PREFIX = 'SYSU-Software'
    FLASKY_MAIL_SENDER = 'SYSU Software 2015 <SYSU.Software2015@gmail.com>'

    # inner picture server
    UPLOAD_FOLDER = '/tmp'
    ALLOWED_EXTENSIONS = set(['jpg','png','jpeg'])
    MAX_CONTENT_LENGTH = 4 * 1024 * 1024 # 4MB

    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "sqlite:////tmp/sysu2015_dev.db"

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

