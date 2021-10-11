from flask import Flask, render_template

app = Flask(__name__)


@app.route("/", methods=['GET'])
def start():
    return render_template('index.html')


@app.route('/quiz', methods=['POST'])
def process_quiz():
    # TODO
    return


@app.route('/upload', methods=['POST'])
def process_upload():
    # TODO
    return


@app.route('/results', methods=['GET'])
def render_results():
    return render_template('results.html')
