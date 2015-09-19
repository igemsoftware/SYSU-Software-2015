from server import create_app
from gevent.wsgi import WSGIServer

# Change the host and port here
HOST = '0.0.0.0'
PORT = 8888

app = create_app('development') 
kwargs = {
            'host':HOST,
            'port':PORT,
         }

if __name__ == '__main__':
    #app.run(**kwargs)
    from gevent import monkey
    monkey.patch_socket()
    server = WSGIServer((HOST, PORT), app)
    server.serve_forever()

