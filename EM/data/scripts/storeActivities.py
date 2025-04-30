# 1 argument : json/CSV file name

import json
import os
import requests
import sys
import csv



url = "http://localhost:8080/activity/store"


scriptpath = os.path.dirname(os.path.abspath(__file__))
print("PATH: " +  scriptpath)

jsonpath = scriptpath + '/json/' + sys.argv[1] + '.json'
csvpath = scriptpath + '/outputData/' + sys.argv[1] + '.csv'

data = []
with open(csvpath) as csvFile:
    csvReader = csv.DictReader(csvFile, delimiter = ';')
    for rows in csvReader:
        data.append(rows)

jsonObject = { "activities" : data}
with open(jsonpath, 'w', encoding='utf-8') as jsonFile:
    jsonFile.write(json.dumps(jsonObject))


headers = {'Content-type': 'application/json', 'Accept': 'application/json'}
x = requests.post(url, data = json.dumps(jsonObject), headers=headers)

print(x.json)
print("end")