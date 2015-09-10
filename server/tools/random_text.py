from numpy.random import choice
from numpy import array

wl = []
a = []
def random_text(n):
    global wl, a

    if not wl:
        with open('server/tools/word_list.txt', 'r') as f:
            wl = map(lambda x: x.strip(), f.read().split('\n'))
            a = [1.] * len(wl)
            wl += ['.',',','!','?']
            a += [100.]*4

            a = array(a, dtype=float)
            a /= a.sum()

    return ' '.join( choice(wl, n, p=a) )
