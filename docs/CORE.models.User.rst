===================================
``CORE.models.User`` -- User models
===================================

.. automodule:: server.models
.. autoclass:: User

    .. automethod:: __init__

    .. autoattribute:: id
    .. autoattribute:: username 
    .. autoattribute:: email 
    .. autoattribute:: password_hash
    .. autoattribute:: salt 
    .. autoattribute:: password
    .. automethod:: verify_password
    
    .. autoattribute:: reg_date
    .. autoattribute:: last_seen 
    .. automethod:: ping 

    .. autoattribute:: msg_box 
    .. autoattribute:: sent_messages
    .. automethod:: send_message_to

    .. autoattribute:: watched_tasks
    .. automethod:: create_task 
    .. automethod:: watch_task
    .. automethod:: make_comment

    .. automethod:: send_email 

    .. autoattribute:: memos 
    .. autoattribute:: memo_ahead 
    .. autoattribute:: memo_email 
    .. automethod:: add_memo 
    .. automethod:: check_memo 
    .. automethod:: get_memos_during

    .. autoattribute:: tracks

    .. autoattribute:: favorite_circuits 
    .. autoattribute:: circuits 

.. automodule:: server.models.user
.. autoclass:: AnonymousUser
