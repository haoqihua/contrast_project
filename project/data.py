import os
import requests
import json
from flask import Flask
from flask import render_template
from flask import request

JSON_FILE_LOC="attacks.json"
IP_TO_GEO_API="https://ipapi.co/"
JSON_FORMAT="/json"
IP_COLUMN="IP"
REASON_COLUMN="REASON"
DETAIL_COLUMN="detail"
COUNTRY_COLUMN="country_name"
LAT_COLUMN="latitude"
LONG_COLUMN="longitude"

def prone_json(data):
    result=[]
    for entry in data:
        one_column={IP_COLUMN:entry[IP_COLUMN],
            REASON_COLUMN:entry[REASON_COLUMN],
            COUNTRY_COLUMN:entry[DETAIL_COLUMN][COUNTRY_COLUMN],
            LAT_COLUMN:entry[DETAIL_COLUMN][LAT_COLUMN],
            LONG_COLUMN:entry[DETAIL_COLUMN][LONG_COLUMN]
        }
        result.append(one_column)

    return result
    
def get_ip(data):
    for entry in data:

        r = requests.get(IP_TO_GEO_API+entry[IP_COLUMN]+JSON_FORMAT)
        entry['detail']=r.json()

    return data
    
def get_single_ip(entry):
    r = requests.get(IP_TO_GEO_API+entry[IP_COLUMN]+JSON_FORMAT)
    entry['detail']=r.json()
    
    return entry

def read_n_locations(num):
    #print(num)
    with open(JSON_FILE_LOC) as f:
        data = json.load(f)
        num=int(num)
        if num<len(data)-1:
            data=get_ip(data[0:num+1])
        else:
            data=get_ip(data[0:-1])
    #print(len(data))        
    data=prone_json(data)    
    return json.dumps(data)

def search_certain_ip(IP_addr):
    with open(JSON_FILE_LOC) as f:
        data = json.load(f)
        for entry in data:
            if entry[IP_COLUMN]==IP_addr:
                result=get_single_ip(entry)
                return json.dumps([result])
        return json.dumps([])
        
#Testing Purposes:

#print(read_n_locations(10))
#print(search_certain_ip("1.1.228.40"))