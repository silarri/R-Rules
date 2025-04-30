#!/bin/bash
# Convert data from csv and api, and inserts into database
# Script with 2 arguments:
#   1- firstId (0)
#   2- numberOfItems of each category type (7)

python3 storeActivities.py placesOfInterest
python3 storeActivities.py shops
python3 storeActivities.py accommodation
python3 storeActivities.py entertainmentEstablishments
python3 storeActivities.py museums
python3 storeActivities.py leisure
python3 storeActivities.py restaurants
python3 storeActivities.py showsHalls