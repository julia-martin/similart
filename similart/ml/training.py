import os

import h5py
import joblib
import numpy as np
from sklearn.decomposition import PCA
from sklearn.manifold import Isomap

dirname = os.path.dirname(__file__)
DATA_PATH = os.path.join(dirname, '../data/hdf5/artworks.h5')


class Trainer:
    def _init_(self):

        self.h5 = h5py.File(DATA_PATH, 'r')

    def pca_train(self):
        # Captures 90% Variability
        pca = PCA(.9)
        n = 3000

        train_data = self.h5['images'][:n].reshape(n, 270000)
        converted_data = pca.fit_transform(train_data)

        self._write_model_files(pca, converted_data)

    def isomap_train(self):
        # Captures 90% Variability
        iso = Isomap(.9)
        n = 3000

        # Code to train ISOMAP
        # Ultimately chose PCA due to Accuracy and Performance
        train_data = self.h5['images'][:n].reshape(n, 270000)
        converted_data = iso.fit_transform(train_data)

        self._write_model_files(iso, converted_data)

    def _write_model_files(self, model, converted_data):

        joblib.dump(model, 'model/PCA_Model.joblib')
        np.save('model/PCA_Images.npy', converted_data)
