# -*- coding: utf-8 -*-

import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = "a09sd8f1=-=1f-12=-12=-f1=2-f1-=2fHieveryone" 

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
    UPLOAD_FOLDER = 'files/' # for flask
    UPLOAD_FOLDER_FULL = 'server/files' # for other apps
    ALLOWED_EXTENSIONS = set(['jpg','png','jpeg'])
    MAX_CONTENT_LENGTH = 4 * 1024 * 1024 # 4MB
    PICTURE_CROP_SIZE = (50, 50) 

    #
    FLASKY_TASKS_PER_PAGE = 2
    FLASKY_DESIGNS_PER_PAGE = 7

    # init
    INIT_PRELOAD_DEVICE_DIRS = ['server/models/preload/devices/'] #EquationTest']
    INIT_PRELOAD_PROTOCOL_DIRS = ['server/models/preload/protocols/']
    INIT_PRELOAD_PART_DIRS = ['server/models/preload/components/']#EquationTest']
    INIT_PRELOAD_EQUATION_DIRS = ['server/models/preload/equations/']



    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///sysu2015_dev.db"

class ProductionConfig(Config):
    DEBUG = False 
    TESTING = False
    SQLALCHEMY_DATABASE_URI = "sqlite:///sysu2015_pro.db"
    #SQLALCHEMY_DATABASE_URI = "mysql://"

class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///test.db"

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

