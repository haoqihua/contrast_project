import os
import requests
import json

from flask import Flask
from flask import render_template
from flask import request

import data

#https://www.csee.umbc.edu/courses/331/fall10/notes/python/python3.ppt.pdf
def _json_object_hook(d): return namedtuple('X', d.keys())(*d.values())
def json2obj(data): return json.loads(data, object_hook=_json_object_hook)

app = Flask(__name__)

@app.route('/')
def default():
    return "main_page"
    

@app.route('/map')
def main_page():

    return render_template('map.html')
    

    
@app.route('/load_n_locations/<num>',methods=['POST'])
def load_n_locations(num):
    
    return data.read_n_locations(num)

    
@app.route('/search/<IP_addr>',methods=['POST'])
def search(IP_addr):
    return data.search_certain_ip(IP_addr)

app.run(host=os.getenv('IP', '0.0.0.0'),port=int(os.getenv('PORT', 80)))
