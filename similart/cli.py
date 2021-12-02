import os
import os.path as path
import secrets

import click

from similart.data.ingestor import ImageIngestor
from similart.ml.training import Trainer


def ingest_data():

    print('Ingesting data (this may take some time)...')
    ingestor = ImageIngestor()
    ingestor.ingest()


def build_model():

    print('Training model (this may take some time)...')
    trainer = Trainer()
    trainer.pca_train()


@click.group()
def cli():
    pass


@click.command()
def run():
    """Checks for trained model and data files, creates if needed and starts flask app"""

    dirname = path.dirname(__file__)

    data_location = path.join(
        dirname, path.join('data', 'hdf5', 'artworks.h5'))
    model_location = path.join(dirname, 'ml', 'model', 'PCA_model.joblib')

    if not path.exists(data_location):
        ingest_data()
    if not path.exists(model_location):
        build_model()

    os.environ['FLASK_APP'] = os.path.join('similart', 'app.py')
    os.environ['SECRET_KEY'] = secrets.token_hex(16)

    os.system('flask run')


@ click.command()
def refresh():
    """Re-downloads data and trains model, regardless of presence of files"""

    ingest_data()
    build_model()


cli.add_command(run)
cli.add_command(refresh)
