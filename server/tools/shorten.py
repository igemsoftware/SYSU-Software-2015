def shorten(text, length=20):
    if len(text) > length:
        return text[:length-4]+' ...'
    else:
        return text
    
