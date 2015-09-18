===========================================
``CORE.models.Equation`` -- Equation models
===========================================

.. automodule:: server.models

.. autoclass:: Equation 

    .. automethod:: __init__
    .. autoattribute:: parameters
    .. autoattribute:: content 
    .. automethod:: render


.. autoclass:: EquationBase
    
    .. autoattribute:: id
    .. autoattribute:: related_count 
    .. autoattribute:: _content
    .. autoattribute:: content

    .. autoattribute:: target
    .. autoattribute:: related 
    .. autoattribute:: parameter
    .. autoattribute:: formular

    .. automethod:: packed
    .. automethod:: commit_to_db 
    .. automethod:: update_from_db
