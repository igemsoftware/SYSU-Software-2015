===========================================
``CORE.routes.calendar`` -- Calendar routes 
===========================================

.. currentmodule:: server.models

``CORE.routes.calendar`` is the route for the calendar part. 
Prefix is ``/calendar``.


``/calendar/all``
-------------------
:Method: GET
:Note: Login required.
:Usage: To get all your :attr:`Memo`.
:Output: a json array named ``event``.

.. _calendar-example:

:Output Example:

.. code-block:: json

    {
      "events": [
        {
          "end": "2015/08/09 00:00",
          "error": "No errors occured",
          "id": 1,
          "protocol": "2-3",
          "record": "Things went well",
          "start": "2015/08/08 00:00",
          "title": "Experiment #34"
        },
        {
          "end": "2015/09/05 08:00",
          "error": "Wish not",
          "id": 2,
          "protocol": "No",
          "record": "Maybe a pill will help",
          "start": "2015/09/04 23:46",
          "title": "Time to sleep"
        }
      ]
    }


``/calendar/all``
-------------------
:Method: POST 
:Content-type: application/json
:Note: Login required.
:Usage: To update all your :attr:`Memo`.
:Input: A json array.
:Output: A success message. 
:Input Example: 

.. code-block:: json

    [{ 
        "end": "2015/08/09 00:00", 
        "error": "", 
        "id": 1, 
        "protocol": "", 
        "record": "", 
        "start": "2015/08/08 00:00", 
        "title": "Long Sleep" 
    }]


``/calendar/all``
-------------------
:Method: DELETE 
:Note: Login required.
:Usage: To deleta one of your :attr:`Memo`.
:Output: A success message. 
:Input: An 'id' field filled with id number.




``/calendar/day/<string:date>``
-------------------------------
:Method: GET
:Note: Login required.
:Usage: To get your :attr:`Memo` in a specific day.
:Input: a date in ``<year>-<month>-<day>`` format.
:Output: a json array named ``event``.
:Example: see calendar-example_. 
