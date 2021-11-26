import os

from flask import Flask, flash, redirect, render_template, request, session
from PIL import Image

from similart.ml.model import Model
from similart.quiz import get_graph_data

app = Flask(__name__, instance_relative_config=True)

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', None)
port = int(os.environ.get("PORT", 5000))

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


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
    model = Model(img)
    session['data'] = model.construct_network()

    return redirect('/results')


@app.route('/select', methods=['POST'])
def process_selection():
    img_id = request.form['selected-work']

    print('image id is {}'.format(img_id))

    img = Image.open(os.path.join(os.path.dirname(
        __file__), 'static/images/{}.jpeg'.format(img_id)))

    model = Model(img)
    session['data'] = model.construct_network()

    print(session['data'])

    return redirect('/results')


@app.route('/quiz', methods=['POST'])
def process_quiz():
    theme = request.form.getlist('theme')
    art_type = request.form['type']
    session['data'] = get_graph_data(theme, art_type)
    return redirect('/results')


@app.route('/results', methods=['GET'])
def results():

    results_data = session['data']
    return render_template('results.html.jinja', results_data=results_data)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=port, debug=True)
