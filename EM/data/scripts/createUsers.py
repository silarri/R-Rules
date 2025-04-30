import csv
import sys
import os
import random
import datetime

maxUsers = 400
domain = "@cars-em.com"

def randomDate():
    startDate = datetime.date(1950, 1, 1)
    endDate = datetime.date(2010, 1, 1)

    time_between_dates = endDate - startDate
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    random_date = startDate + datetime.timedelta(days=random_number_of_days)
    return random_date


def createUsers(csvfile):
    # Open CSV
    csvf = open(csvfile,'w',encoding='utf-8')
    csvfile_writer = csv.writer(csvf, delimiter=";")

    # ADD THE HEADER TO CSV FILE
    csvfile_writer.writerow(["id", "email", "password", "genre", "birth"])

    genreOptions = ["male", "female", "other"]
    for i in range(1,maxUsers + 1):
        
        email = "user" + str(i) + domain
        password = "12345678test"

        j = random.randint(0,2)
        genre = genreOptions[j]
        birth = randomDate()
    
        csv_line = [i,email, password, genre, birth]
        # ADD A NEW ROW TO CSV FILE
        csvfile_writer.writerow(csv_line) 


scriptpath = os.path.dirname(os.path.abspath(__file__))
print("PATH: " +  scriptpath)
csvpath = scriptpath + '/outputData/' + sys.argv[1] + '.csv'

createUsers(csvpath)

