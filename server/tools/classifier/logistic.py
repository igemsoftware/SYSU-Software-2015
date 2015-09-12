import numpy as np

__example_data = ([[1, 8],
                 [2, 8],
                 [0, 6],
                 [-1, 0],
                 [4, 0],
                 [6, 0],
                 [5, 2]],
                 [0,0,0,1,1,1,1])

class LogisticRegression():

    def __init__(self):
        pass

    @staticmethod
    def sigmoid(z):
        return 1/(1+np.exp(-z))

    def fit(self, x, y,
                 max_iteration=100, plot_interval=10,
                 lr=0.01, slient=False):
        '''

            x is [n * d], n is the number of instances,
                          d is the dimension of each instance.

        '''

        raw_x = np.array(x)
        x = np.concatenate([raw_x, np.ones((raw_x.shape[0], 1))], 1)
        y = np.array(y)
        if (len(x.shape) != 2):
            raise ValueError("X must has 2-d matrix.")
#       if (x.shape[1] != self.dim):
#           raise ValueError("The dimension of data is unequal.")
        # other checking ...

        self.x = x
        self.raw_x = raw_x
        self.n, self.dim = x.shape
        self.y = y.reshape(1, self.n)
        self.lr = lr
        self.theta = np.random.uniform(-1, 1, size=(1, self.dim) )

        for iteration in range(max_iteration):
            self.theta = self.theta - self.lr * \
                    np.dot( (self.sigmoid(np.dot(self.theta, x.T)) - self.y), self.x)

            if iteration % plot_interval == 0 and not slient:
                print 'iteration %d:' % iteration
                print '\ttheta:', self.theta
                print '\tdot:', np.dot(self.theta, x.T)
                print '\tpredict:', self.binary_predict(self.raw_x)
                print '\taccuracy = %d/%d' % ( ( (self.binary_predict(self.raw_x)) == self.y).sum(), self.n)

        return self.theta

    def predict(self, x):
        x = np.concatenate([x, np.ones((x.shape[0], 1))], 1)
        return self.sigmoid(np.dot(self.theta, x.T))

    def binary_predict(self, x):
        x = np.concatenate([x, np.ones((x.shape[0], 1))], 1)
        return np.round(self.sigmoid(np.dot(self.theta, x.T)))

if __name__ == '__main__':
    c = LogisticRegression()
    x = np.array([[1, 8],
                  [2, 8],
                  [0, 6],
                  [-1, 0],
                  [4, 0],
                  [6, 0],
                  [5, 2]])
    y = np.array([0,0,0,1,1,1,1])

    c = LogisticRegression().fit(x, y, max_iteration = 10, plot_interval=1, lr=1)


