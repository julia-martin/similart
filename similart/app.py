import os

import numpy as np
from flask import Flask, flash, redirect, render_template, request, session
from PIL import Image
from skimage import transform

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(12).hex()

DUMMY_DATA = [
    {"title": "Mona Lisa", "artist": "Leonardo Da Vinci", "category": "Classical", "year": 1400},
    {"title": "The Basket of Apples", "artist": "Paul Cézanne", "category": "Painting and Sculpture of Europe", "year": 1893},
    {"title": "Afterglow", "artist": "Jonas Lie", "category": "Arts of the Americas", "year": 1909}
]


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def img_to_array(img):
    npimg = np.array(img)
    return transform.resize(npimg, [300, 300, 3], preserve_range=True).astype('uint8')


@app.route("/", methods=['GET'])
def start():
    return render_template('index.html.jinja')


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
    session['data'] = DUMMY_DATA
    return redirect('/results')


@app.route('/select', methods=['POST'])
def process_selection():
    img_id = request.form['selected-work']
    img = Image.open(f'./static/images/{img_id}.jpeg')
    resized_img = img_to_array(img)  # noqa: F841
    # TODO: Run ML model and include output in render_template
    session['data'] = DUMMY_DATA
    return redirect('/results')


@app.route('/quiz', methods=['POST'])
def process_quiz():
    theme = request.form.getlist('theme')  # noqa: F841
    art_type = request.form['type']  # noqa: F841
    # TODO: Run ML model and include output in render_template
    session['data'] = DUMMY_DATA
    return redirect('/results')


@app.route('/results', methods=['GET'])
def results():
    results_data = session['data']
    return render_template('results.html.jinja', results_data=results_data)
