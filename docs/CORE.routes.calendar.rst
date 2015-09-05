===========================================
``CORE.routes.calendar`` -- Calendar routes 
===========================================

``CORE.routes.auth`` is the entrance of login, logout and registration.
Prefix is ``/auth``.
    
``/auth/register``
-------------------
:Usage: The page where you can register. For the security issue, we strongly recommend that you should use our webpage to register instead of sending POST request directly.
:Data Format: Contains username, email, password, tracks' number and avatar url. 


``/auth/login``
-------------------
:Usage: The page where you can login. For the security issue, we strongly recommend that you should use our webpage to login instead of sending POST request directly.
:Data Format: Contains username and password. 


``/auth/logout``
-------------------
:Note: Login required.
:Usage: Access this route can logout your accout.
:Data: None 
