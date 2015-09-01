from server import create_app

app = create_app('development') 
kwargs = {
            'host':'0.0.0.0',
            'port':8000
         }

if __name__ == '__main__':
    app.run(**kwargs)
