import numpy as np
from flask import current_app

__example_data = ([[1, 8],
                 [2, 8],
                 [0, 6],
                 [-1, 0],
                 [4, 0],
                 [6, 0],
                 [5, 2]],
                 [0,0,0,1,1,1,1])

class LogisticRegression():
    """
        Classifier class using Logistic Regression.
        We use Gradient Descent to train it on collected and cropped data to get a robust classifier.
        And we then apply the classifier on a new design to determine whether it's good or not to be public.
    """

    def __init__(self):
        pass

    @staticmethod
    def sigmoid(z):
        """
            Sigmoid function that applied element-wise.
        """
        return 1/(1+np.exp(-z))

    def fit_from_file(self, filename, ignoreline=1, **kwargs):
        """
            Train classifier by using data fetched in a file. The format is given in the example csv file.
        """
        with open(filename, 'r') as f:
            # split lines
            # split values
            # translate string into value
            a = np.array(map(lambda x: map(float, x.strip().split(',')), f.read().strip().split('\n')[ignoreline:]))
        print a
        x = a[:, :7]
        y = a[:, 7]

        # train with default settings
        self.fit(x, y, max_iteration = 400, plot_interval=10, lr=0.01, **kwargs)
        return self


    def fit(self, x, y,
                 max_iteration=100, plot_interval=10,
                 lr=0.01, slient=False):
        '''
            Train classifier with given x and y. The user can also set the maximum iteration and learning rate.

            slient and plot_interval only affect on the terminal.
    
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
        self.accuracy = []

        for iteration in range(max_iteration):
            # stochastic gradient descent
            #random_ind = np.random.randint(0, self.n)
            #rx = self.x[random_ind].reshape(1, 8)
            #ry = self.y[0][random_ind]

            self.theta = self.theta - self.lr * \
                    np.dot( (self.sigmoid(np.dot(self.theta, self.x.T)) - self.y), self.x)

            if iteration % plot_interval == 0 and not slient:
                print 'iteration %d:' % iteration
                print '\ttheta:', self.theta
                print '\tdot:', np.dot(self.theta, x.T)
                print '\tpredict:', self.binary_predict(self.raw_x)
                print '\taccuracy = %d/%d' % ( ( (self.binary_predict(self.raw_x)) == self.y).sum(), self.n)
                self.accuracy.append( float(((self.binary_predict(self.raw_x)) == self.y).sum())/self.n)
        return self


    def predict(self, x):
        """
            Predict a list of given x.

            The input x must align with the X in training set.

            The ouput is the possiblity of the given input's belongingness to class 1.
        """
        x = np.array(x)
        x = np.concatenate([x, np.ones((x.shape[0], 1))], 1)
        return self.sigmoid(np.dot(self.theta, x.T))

    def binary_predict(self, x):
        """
            The similar usage as ``predict`` . It will classify X into 2 classes (0 or 1).
        """
        x = np.array(x)
        x = np.concatenate([x, np.ones((x.shape[0], 1))], 1)
        return np.round(self.sigmoid(np.dot(self.theta, x.T)))

if __name__ == '__main__':
#   example data
#   x = np.array([[1, 8],
#                 [2, 8],
#                 [0, 6],
#                 [-1, 0],
#                 [4, 0],
#                 [6, 0],
#                 [5, 2]])
#   y = np.array([0,0,0,1,1,1,1])

    c = LogisticRegression()
    
    # equivalent
    #c.fit_from_file('server/tools/classifier/data.csv', return_acc=True, slient=True)

    with open('server/tools/classifier/data.csv', 'r') as f:
        a = np.array(map(lambda x: map(float, x.strip().split(',')), f.read().strip().split('\n')[1:]))
    x = a[:, :7]
    y = a[:, 7]

    from datetime import datetime
    start = datetime.now()
    c.fit(x, y, max_iteration = 400, plot_interval=10, lr=0.01)
    end = datetime.now()

    print c.accuracy
    print (end-start).total_seconds()


