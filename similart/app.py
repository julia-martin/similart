import os

import numpy as np
from flask import Flask, flash, redirect, render_template, request, session
from PIL import Image
from skimage import transform

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(12).hex()


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def img_to_array(img):
    npimg = np.array(img)
    return transform.resize(npimg, [300, 300, 3], preserve_range=True).astype('uint8')


@app.route("/", methods=['GET'])
def start():
    return render_template('index.html.jinja')


@app.route('/quiz', methods=['POST'])
def process_quiz():
    # theme = request.form['theme']
    img_id = request.form['selected-work']
    img = Image.open(f'./static/images/{img_id}.jpeg')
    resized_img = img_to_array(img)  # noqa: F841
    # TODO: Run ML model and include output in render_template
    session['data'] = 'ML OUTPUT'
    return redirect('/results')


@app.route('/upload', methods=['POST'])
def process_upload():
    # From docs: https://flask.palletsprojects.com/en/2.0.x/patterns/fileuploads/
    if ('file' not in request.files) or (request.files['file'].filename == ''):
        flash('No selected file')
        return redirect('/')
    img_file = request.files['file']
    if not allowed_file(img_file.filename):
        flash('Must be .png, .jpg, or .jpeg')
        return redirect('/')

    img = Image.open(img_file)
    resized_img = img_to_array(img)  # noqa: F841
    # TODO: Run ML model and include output in render_template
    session['data'] = 'ML OUTPUT'
    return redirect('/results')


@app.route('/results', methods=['GET'])
def results():
    data = session['data']
    return render_template('results.html.jinja', data=data)
