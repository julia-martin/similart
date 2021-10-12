from flask import Flask, render_template

app = Flask(__name__)


@app.route("/", methods=['GET'])
def start():
    return render_template('index.html.jinja')


@app.route('/quiz', methods=['POST'])
def process_quiz():
    # TODO: Run ML model and include output in render_template
    return render_template('results.html')


@app.route('/upload', methods=['POST'])
def process_upload():
    # TODO: Run ML model and include output in render_template
    return render_template('results.html')


@app.route('/results', methods=['GET'])
def render_results():
    return render_template('results.html')
