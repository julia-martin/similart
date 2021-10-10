from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def start():
    # This is a test comment
    return render_template('index.html')
