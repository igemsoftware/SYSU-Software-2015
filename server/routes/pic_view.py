from . import pic

from flask import current_app

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in current_app.config['ALLOWED_EXTENSIONS']

@pic.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)

        # filename collision detection should be here
        # file compress should be here 

        file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
        return 'json that indicates succeed'
    else:
        return 'error'

#   <form action="" method=post enctype=multipart/form-data>
#   <p><input type=file name=file>
#       <input type=submit value=Upload>
#   </form>

@pic.route('/fetch/<path:userdir><filename>')
def get_pic(userdir, filename):
    return send_from_directory(userdir, filename) 


