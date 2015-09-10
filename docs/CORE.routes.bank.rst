===========================================
``CORE.routes.db`` -- Database routes 
===========================================

.. currentmodule:: server.models

``CORE.routes.bank`` is the route for the database part. 
Prefix is ``/bank``.

``/bank/list``
-------------------
:Usage: Get a list of :class:`Design` . 
:Output: A list of :class:`Design` . 
:Argument:

* per_page: How many tasks per page. (default=9)
* page: Which page you want to get. (default=1) 
* keyword: Sort by ``id``, ``user``, ``rate``, or ``last-active`` . (default= ``id`` )

:Output Example: 

.. code-block:: json

   {
      "designs": [
        {
          "comments": 0,
          "contributor": "test",
          "description": "First design",
          "id": 1,
          "last active": "2015-09-10 19:46:58",
          "name": "My first design",
          "rate": 0
        },
        {
          "comments": 0,
          "contributor": "test",
          "description": "Second design",
          "id": 2,
          "last active": "2015-09-10 19:46:58",
          "name": "My second design",
          "rate": 0
        } 
    }
