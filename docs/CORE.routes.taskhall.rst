=================================================
``CORE.routes.taskhall`` -- Taskhall routes 
=================================================

.. currentmodule:: server.models

``CORE.routes.taskhall`` is the route for the taskhall. 
Prefix is ``/taskhall``.

``/taskhall/list``
-------------------
:Usage: Get a list of :class:`Task` . 
:Output: A list of :class:`Task` . 
:Argument:

* per_page: How many tasks per page. (default=2)
* page: Which page you want to get. (default=1) 
* keyword: Sort by ``time``, ``vote`` or ``view`` . (default= ``time`` )

:Output Example: 

.. code-block:: json

    {
      "tasks": [
        {
          "abstract": null,
          "content": "int x = 10;\n while (x --> 0) {\\\\ x count down to 0\n \\\\foo\n}",
          "id": 3,
          "sender_id": 2,
          "timestamp": "datetime.datetime(2015, 9, 4, 9, 46, 41, 898979)",
          "title": "What is the name of the \"-->\" operator in C?",
          "views": 19,
          "votes": 20
        },
        {
          "abstract": null,
          "content": "What IDEs (\"GUIs/editors\") do others use for Python coding?",
          "id": 2,
          "sender_id": 2,
          "timestamp": "datetime.datetime(2015, 9, 4, 9, 46, 41, 695891)",
          "title": "What IDE to use for Python?",
          "views": 24,
          "votes": 12
        }
      ]
    }




