def shorten(text, length=20):
    """
        Shorten the ``text`` with maximum ``length`` . Used to shorten a long passage.
    """
    if len(text) > length:
        # return a shortened text
        return text[:length-4]+' ...'
    else:
        return text
    
