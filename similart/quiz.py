import json
import os
import random


def set_num_nodes(checkboxes):
    checkbox_to_nodes = {1: 10, 2: 8, 3: 6, 4: 5, 5: 4, 6: 4, 7: 4}
    if len(checkboxes) in checkbox_to_nodes:
        num_nodes = checkbox_to_nodes[len(checkboxes)]
    else:
        num_nodes = 3

    return num_nodes


def get_shuffled_json(category):
    # Read in json file
    dirname = os.path.dirname(__file__)

    json_file = open(os.path.join(
        dirname, 'static', 'data', 'similart_data.json'), encoding='utf-8')
    json_obj = json.load(json_file)

    # 1. randomly shuffle the json keys
    json_keys = list(json_obj.keys())
    shuffled_keys = random.sample(json_keys, len(json_keys))

    # 2. filter on category
    if category == 'contemporary':
        shuffled_keys = [
            k for k in shuffled_keys if 'modern and contemporary art' in json_obj[k]['classification_titles']]
    elif category == 'traditional':
        shuffled_keys = [
            k for k in shuffled_keys if 'modern and contemporary art' not in json_obj[k]['classification_titles']]

    return shuffled_keys, json_obj


def get_graph_data(checkboxes, category):
    distance = 1000
    num_nodes = set_num_nodes(checkboxes)
    shuffled_keys, json_obj = get_shuffled_json(category)
    graph_data = {'nodes': [], 'edges': []}

    for box in checkboxes:
        center_node = 0
        count = 0
        for k in shuffled_keys:
            if box in json_obj[k]['similart_tags']:
                if count == 0:
                    center_node = k
                    if {'id': k} not in graph_data['nodes']:
                        graph_data['nodes'].append({'id': k})
                else:
                    if {'id': k} not in graph_data['nodes']:
                        graph_data['nodes'].append({'id': k})
                    graph_data['edges'].append(
                        {'source': center_node, 'target': k, 'distance': distance})
                count += 1

            if count == num_nodes:
                break

    return graph_data
