=================================================
``CORE.routes.pic`` -- Picture server routes 
=================================================

.. currentmodule:: server.models

``CORE.routes.pic`` is the route for the picture server. 
Prefix is ``/person``.


``/pic/upload``
----------------------------------------
:Method: GET 
:Usage: A simple form to upload file. Use in development.
    
``/pic/upload``
----------------------------------------
:Method: POST 
:Usage: The entrance of uploading file. 

``/pic/fetch/<path:filename>``
----------------------------------------
:Usage: Get a file named ``filename`` in the picture server. 



