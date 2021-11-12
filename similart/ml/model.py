import os

import h5py
import joblib
import numpy as np
from PIL import Image
from sklearn.neighbors import NearestNeighbors

dirname = os.path.dirname(__file__)
DATA_PATH = os.path.join(dirname, '../data/hdf5/artworks.h5')
MODEL_PATH = os.path.join(dirname, 'model/PCA_Model.joblib')
CONVERTED_DATA_PATH = os.path.join(dirname, 'model/PCA_Images.npy')


class Model:
    def __init__(self, image):
        self.image = image
        self.h5 = h5py.File(DATA_PATH, 'r')
        self.pca_model = joblib.load(MODEL_PATH)
        self.converted_data = np.load(CONVERTED_DATA_PATH)
        self.network = None

    @property
    def image(self):
        return self._image

    @image.setter
    def image(self, image):
        if isinstance(image, np.ndarray):
            self._image = np.array(image).reshape(1, 270000)
        else:
            image = image.resize((300, 300), Image.ANTIALIAS)
            self._image = np.array(image).reshape(1, 270000)

    def construct_network(self):
        """Combines nodes and edges list to create a network"""

        # Initializes the node and edge list
        nodes, edges = [], []

        # Constructs n nearest neighbors for original image
        dist, argdist = self.art_neighbors(self.image)

        nodes.append(self.create_nodes(argdist))
        edges.append(self.create_edges(dist, argdist))

        # Constructs the second layer of the node network
        for arg in argdist:
            input_image = self.h5['images'][arg]
            array_image = Model.image_to_array(input_image)
            dist, argdist = self.art_neighbors(array_image)

            nodes.append(self.create_nodes(argdist, arg))
            edges.append(self.create_edges(dist, argdist, arg))

        nodes = [item for sublist in nodes for item in sublist]
        edges = [item for sublist in edges for item in sublist]

        unique_nodes = [
            dict(t) for t in {tuple(node.items())
                              for node in nodes}
        ]

        self.network = (unique_nodes, edges)

        graph_data = self._create_graph_data(unique_nodes, edges)

        return graph_data

    def art_neighbors(self, image):
        """Uses flattened numpy array to find the 5 nearest neighbors"""

        neigh = NearestNeighbors(n_neighbors=5, algorithm='ball_tree', p=2)
        neigh.fit(self.converted_data)

        test_data = self.pca_model.transform(image)
        art_neigh = neigh.kneighbors(test_data)

        # dist returns the l2 distance between the source and target nodes
        # argdist returns the target nodes, representede in H5's index

        # We ignore the first image in the list since it will be itself
        distances = list(art_neigh[0].flatten())[1:5]
        argdistances = list(art_neigh[1].flatten())[1:5]

        return distances, argdistances

    def create_nodes(self, argdistances, source=None):
        # 0 will be a special ID that refers to the original uploaded image
        # argdistances refer to the closest images
        # source refers to the index of the source image

        nodes_list = [{
            'id': int(self.h5['ids'][arg])
        } for arg in argdistances]

        if source is None:
            nodes_list.append({'id': 0})
        else:
            nodes_list.append({'id': int(self.h5['ids'][source])})

        return nodes_list

    def create_edges(self, distances, argdistances, source=None):
        # distances refer to the closeness between the source and argdist
        # argdistances refer to the closest images
        # source refers to the index of the source image

        zipdistances = zip(distances, argdistances)

        if source is None:
            edges_list = [{
                'source': 0,
                'target': int(self.h5['ids'][argdistances]),
                'distance': int(distances)
            } for distances, argdistances in zipdistances]

        else:
            edges_list = [{
                'source': int(self.h5['ids'][source]),
                'target': int(self.h5['ids'][argdistances]),
                'distance': int(distances)
            } for distances, argdistances in zipdistances]

        return edges_list

    def _create_graph_data(self, unique_nodes, edges):
        """Returns data as dictionaries for d3 processing"""

        nodes_dict, edges_dict = {}, {}

        nodes_dict['nodes'] = unique_nodes
        edges_dict['edges'] = edges

        dataset = {}
        dataset.update(nodes_dict)
        dataset.update(edges_dict)

        return dataset

    @staticmethod
    def image_to_array(image):

        return np.array(image).reshape(1, 270000)
