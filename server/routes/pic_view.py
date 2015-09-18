# -*- coding: utf-8 -*-

from . import pic

import os
from flask import current_app, request, send_from_directory, \
        abort, jsonify, url_for, render_template, \
        send_from_directory, send_file, safe_join, make_response
from datetime import datetime
from werkzeug import secure_filename
import hashlib

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in current_app.config['ALLOWED_EXTENSIONS']

@pic.route('/upload', methods=['POST', 'GET'])
def upload():
    """
        :Method: GET 
        :Usage: A simple form to upload file. Use in development.

        :Method: POST 
        :Usage: The entrance of uploading file. 
    """
    if request.method == 'POST':
        file = request.files['file']
        if not file:
            return jsonify(uploaded=0, error={'message': 'Please select a file'})
        elif not allowed_file(file.filename):
            return jsonify(uploaded=0,
                error={'message': 'The file extension format is not allowed'})
        else:
            filename = file.filename
            extension = '.'+filename.rsplit('.', 1)[1]

            # avoid filename collision
            filename = hashlib.md5( filename.encode('utf-8')+datetime.now().strftime('%y-%m-%d %H-%M-%S') ).hexdigest() + extension
            fileadr = os.path.join(current_app.config['UPLOAD_FOLDER_FULL'], filename)
            file.save(fileadr)

            # pic compress and crop
            from PIL import Image
            img = Image.open(fileadr)
            l = min(*img.size)
            print (img.size[0]-l/2, img.size[1]-l/2,
                            img.size[0]+l/2, img.size[1]+l/2)
            print img.size
            img = img.crop((img.size[0]/2-l/2, img.size[1]/2-l/2,
                            img.size[0]/2+l/2, img.size[1]/2+l/2))
            img.save(fileadr)

            return jsonify(uploaded=1,
                    url=url_for('pic.fetch', filename=filename, _external=True),
                    filename=filename)
    else:
        return render_template('test/upload_picture.html')

@pic.route('/taskhall/upload', methods=['POST'])
def uploadTaskhall():
    """
        :Method: POST 
        :Usage: The entrance of uploading file. 
    """
    file = request.files['upload']
    error = ''
    if not file:
        return jsonify(uploaded=0, error={'message': 'Please select a file'})
    elif not allowed_file(file.filename):
        return jsonify(uploaded=0,
            error={'message': 'The file extension format is not allowed'})
    else:
        callback = request.args.get("CKEditorFuncNum")

        filename = file.filename
        extension = '.'+filename.rsplit('.', 1)[1]

        # avoid filename collision
        filename = hashlib.md5( filename.encode('utf-8')+datetime.now().strftime('%y-%m-%d %H-%M-%S') ).hexdigest() + extension
        fileadr = os.path.join(current_app.config['UPLOAD_FOLDER_FULL'], filename)
        file.save(fileadr)

        # pic compress and crop
        from PIL import Image
        img = Image.open(fileadr)
        l = min(*img.size)
        print (img.size[0]-l/2, img.size[1]-l/2,
                        img.size[0]+l/2, img.size[1]+l/2)
        print img.size
        img = img.crop((img.size[0]/2-l/2, img.size[1]/2-l/2,
                        img.size[0]/2+l/2, img.size[1]/2+l/2))
        img.save(fileadr)

        url=url_for('pic.fetch', filename=filename, _external=True)
        res = """
            <script type="text/javascript">
          window.parent.CKEDITOR.tools.callFunction(%s, '%s', '%s');
        </script>
        """ % (callback, url, error)
        response = make_response(res)
        response.headers["Content-Type"] = "text/html"
        return response

@pic.route('/fetch/<path:filename>')
def fetch(filename):
    """
        :Usage: Get a file named ``filename`` in the picture server. 
    """
    filename = filename.strip()
    if '..' in filename or filename.startswith('/'):
        return 'not found'
        abort(404)
    else:
        #print current_app.root_path
        return send_file(safe_join(current_app.config['UPLOAD_FOLDER'], filename))
#        return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)

