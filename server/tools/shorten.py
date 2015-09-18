def shorten(text, length=20):
    """
        shorten
    """
    if len(text) > length:
        return text[:length-4]+' ...'
    else:
        return text
    
