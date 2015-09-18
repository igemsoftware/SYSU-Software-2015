from numpy.random import choice
from numpy import array

# word list
wl = []
# the possiblity of each words
a = []
def random_text(n):
    """
        Generate a random text with length ``n`` . Mostly used in testing stage.
    """
    global wl, a

    if not wl:
        # open the word dictionary
        with open('server/tools/word_list.txt', 'r') as f:
            wl = map(lambda x: x.strip(), f.read().split('\n'))
            a = [1.] * len(wl)
            # add some punctuation
            wl += ['.',',','!','?']
            a += [100.]*4

            a = array(a, dtype=float)
            # normalize
            a /= a.sum()

    # use space to join each words
    return ' '.join( choice(wl, n, p=a) )
