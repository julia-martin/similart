import h5py
import joblib
import numpy as np
from PIL import Image
from sklearn.neighbors import NearestNeighbors

# Loads image data, reduced numpy representation, and ML model
h5 = h5py.File('artworks.h5', "r")
converted_data = np.load('PCA_Images.npy')
pca_model = joblib.load('PCA_Model.joblib')


def image_toarray(im):
    # Converts 300x300x3 Image to flattened numpy array 1x270000 for analysis
    if type(im) is np.ndarray:
        im_array = np.array(im).reshape(1, 270000)
             
    # If the image is the uploaded image
    else:
        im = im.resize((300, 300), Image.ANTIALIAS)
        im_array = np.array(im).reshape(1, 270000)
    
    return im_array


def art_neighbors(imarray):
    # Uses flattened numpy array to find the 4 closest neighbors

    neigh = NearestNeighbors(n_neighbors=5, algorithm='ball_tree', p=2)
    neigh.fit(converted_data)
    
    test_data = pca_model.transform(imarray)
    art_neigh = neigh.kneighbors(test_data)
    
    # distances returns the euclidean distance between the source and target nodes
    # argdist returns the target nodes, representede in H5's index
    
    # We ignore the first image in the list since it will be itself
    distances = list(art_neigh[0].flatten())[1:5]
    argdistances = list(art_neigh[1].flatten())[1:5]
    
    return distances, argdistances


def create_nodes(argdistances, source=None):
    # 0 will be a special ID that refers to the original uploaded image
    # argdistances refer to the closest images
    # source refers to the index of the source image. None refers to uploaded image

    nodes_list = [{'image': int(h5['ids'][arg])} for arg in argdistances]
    
    if source is None:
        nodes_list.append({'image': 0})
    else:
        nodes_list.append({'image': int(h5['ids'][source])})

    return nodes_list


def create_edges(distances, argdistances, source=None):
    # distances refer to the euclidean distances between the source and argdistance
    # argdistances refer to the closest images
    # source refers to the index of the source image. None refers to uploaded image
    
    zipdistances = zip(distances, argdistances)
    
    if source is None:
        edges_list = [{'source': 0,
                       'target': int(h5['ids'][argdistances]),
                       'distance': int(distances)} for distances, argdistances in zipdistances]
        
    else:
        edges_list = [{'source': int(h5['ids'][source]),
                       'target': int(h5['ids'][argdistances]),
                       'distance': int(distances)} for distances, argdistances in zipdistances]
    
    return edges_list


def construct_network(image):
    # Combines nodes and edges list to create a network
    # image refers to uploaded image
    
    # Initializes the node and edge list
    nodes, edges = [], []

    # Constructs n nearest neighbors for original image
    image = image_toarray(image)
    dist, argdist = art_neighbors(image)
    
    nodes.append(create_nodes(argdist))
    edges.append(create_edges(dist, argdist))

    # Constructs the second layer of the node network
    for arg in argdist:
        input_image = h5['images'][arg]
        array_image = image_toarray(input_image)
        dist, argdist = art_neighbors(array_image)
        nodes.append(create_nodes(argdist, arg))
        edges.append(create_edges(dist, argdist, arg))

    # flattens lists of list
    nodes = [item for sublist in nodes for item in sublist]
    edges = [item for sublist in edges for item in sublist]

    # removes duplicate nodes
    unique_nodes = [dict(t) for t in {tuple(node.items()) for node in nodes}]

    return unique_nodes, edges


def create_json(unique_nodes, edges):
    # Exports nodes and edges to a JSON file for visualization purposes
    # inputs generated from construct_network
    
    nodes_dict, edges_dict = {}, {}
    
    nodes_dict['nodes'] = unique_nodes
    edges_dict['edges'] = edges
    
    dataset = {}
    dataset.update(nodes_dict)
    dataset.update(edges_dict)

    return dataset

