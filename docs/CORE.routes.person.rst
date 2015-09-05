=================================================
``CORE.routes.person`` -- Personal Center routes 
=================================================

.. currentmodule:: server.models

``CORE.routes.person`` is about personal center parts. 
Prefix is ``/person``.
    
``/person/``
-------------------
:Usage: The personal center page. 

``/person/mine``
-------------------
:Usage: Get all my :class:`Circuit` .

``/person/favorite``
-----------------------
:Usage: :class:`User` 's favorite :class:`Circuit` .

``/person/notifications``
--------------------------
:Usage: Get :class:`Message` from :attr:`User.msg_box` . 

``/person/notifications/<int:id>``
----------------------------------------
:Method: POST
:Usage: Mark :attr:`Message.isread` as `True`. 

``/person/notifications/<int:id>``
----------------------------------------
:Method: DELETE 
:Usage: Delete a :class:`Message` .
