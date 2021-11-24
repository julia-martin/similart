import json
import random


def rename_words(checkboxes):
    # rename words in checkboxes to match words in json
    for i, b in enumerate(checkboxes):
        if b == 'still-life':
            checkboxes[i] = 'still'
        if b == 'architecture':
            checkboxes[i] = 'arch'
        if b == 'death-war-violence':
            checkboxes[i] = 'war'
        if b == 'mythology-monsters':
            checkboxes[i] = 'myth'

    return checkboxes


def set_num_nodes(checkboxes):
    if len(checkboxes) == 1:
        num_nodes = 10
    elif len(checkboxes) == 2:
        num_nodes = 8
    elif len(checkboxes) == 3:
        num_nodes = 6
    elif len(checkboxes) == 4:
        num_nodes = 5
    elif len(checkboxes) in [5, 6, 7]:
        num_nodes = 4
    else:
        num_nodes = 3

    return num_nodes


def get_shuffled_json(category):
    # Read in json file
    json_file = open('static/data/similart_data.json', encoding='utf-8')
    json_obj = json.load(json_file)

    # 1. randomly shuffle the json keys
    json_keys = list(json_obj.keys())
    shuffled_keys = random.sample(json_keys, len(json_keys))

    # 2. filter on category
    if category == 'contemporary':
        shuffled_keys = [k for k in shuffled_keys if 'modern and contemporary art' in json_obj[k]['classification_titles']]
    elif category == 'traditional':
        shuffled_keys = [k for k in shuffled_keys if 'modern and contemporary art' not in json_obj[k]['classification_titles']]

    return shuffled_keys, json_obj


def get_graph_data(checkboxes, category):
    checkboxes = rename_words(checkboxes)
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
                    graph_data['edges'].append({'source': center_node, 'target': k, 'distance': 10000})
                count += 1

            if count == num_nodes:
                break

    return graph_data
