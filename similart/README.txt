DESCRIPTION

Similart is an art reccomendation system that returns a graph of reccomended artwork given an image provided
in one of three ways.

1.) An image uploaded from the user
2.) An image selected from the UI shown
3.) A quiz on descriptive preferences

The project is built as a packaged Flask (Python) application with a D3.js frontend, we use a command
line interface to handle data ingestion, model training and launching the web app locally.

INSTALLATION

Similart is built for Python 3.9.0, compatibility with other versions is not guaranteed.

Similart is packaged according to PEP-518 guidelines and is available to be installed via pip from GitHub:

pip install git+https://github.com/samuelhallam/similart.git

To initialize run 'similart run' after install from your terminal/command prompt of choice, this will ingest data and train the model if needed. Ingestion will take
roughly one hour, training will take approximiately five minutes.

To re-ingest and re-train the model you can also run 'similart refresh' which will replace the model and data files
regardless of whether they had been previously created.

EXECUTION

Once launched, the app will be running by default on port 5000. Navigate to http://127.0.0.1:5000 in your browser of
choice and the application is ready to be used. Input images can be entered in any of the three ways listed
in the description section. A recommendation graph will be shown shortly after submission.
