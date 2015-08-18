# -*- coding: utf-8 -*-

from . import pic

import os
from flask import current_app, request, send_from_directory, \
        abort, jsonify, url_for, render_template, \
        send_from_directory, send_file, safe_join
from datetime import datetime
from werkzeug import secure_filename
import hashlib

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in current_app.config['ALLOWED_EXTENSIONS']

@pic.route('/upload', methods=['POST', 'GET'])
def upload():
    if request.method == 'POST':
        file = request.files['file']
        if not file:
            return jsonify(error='Please select a file')
        elif not allowed_file(file.filename):
            return jsonify(error='The file extension format is not allowed')
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

            return jsonify(url=url_for('pic.fetch', filename=filename, _external=True))
    else:
        return render_template('test/upload_picture.html')

@pic.route('/fetch/<path:filename>')
def fetch(filename):
    filename = filename.strip()
    if '..' in filename or filename.startswith('/'):
        return 'not found'
        abort(404)
    else:
        #print current_app.root_path
        return send_file(safe_join(current_app.config['UPLOAD_FOLDER'], filename))
#        return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)

