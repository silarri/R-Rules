import csv
from re import sub
import os
import random


csvNames = ["accommodation", "entertainmentEstablishments", "leisure", "museums", "placesOfInterest",
            "restaurants", "shops", "showsHalls"]

restaurants = ["Vegano", "Vegetariano", "Tapas", "Tabernas"]
placesOfInterest = ["Edificios y monumentos", "Escuelas de cocina y catas de vinos y aceites"]
entertainmentEstablishments = ["Coctelerías, Música directo"]
shops = ["Artesanía", "Regalo-Hogar-Decoración"]
accommodation = ["Hostales", "Apartahoteles"]
museums = ["Museos"]
showsHalls = ["Auditoriums/ConcertHalls"]
leisure = ["CineActividadesAudiovisuales", "DanzaBaile", "CircoMagia"]


def generateGoodRatingsAux(list, user, csvfile_writer):
    for item in list:
        i = random.randint(4,5)
        csv_line = [user, item["id"], i]
        csvfile_writer.writerow(csv_line) 

def generateBadRatingsAux(list, user, csvfile_writer):
    for item in list:
        i = random.randint(0,3)
        csv_line = [user, item["id"], i]
        csvfile_writer.writerow(csv_line) 

def generateRatingsPerCategory(user, category, csv_file, csvfile_writer):
    nUser = user
    for option in category:
        print("TYPE: " + option)
        csv_file_copy = csv_file
        catItems = []
        otherItems = []
        for rows in csv_file_copy:
            subcategories = rows["subcategories"]
            subcategories = subcategories.split(",")
            #print("SUBCATEGORIES: " + str(subcategories))
            # Separate items in the subcategory and the rest
            for s in subcategories:
                if s == option:
                    catItems.append(rows)
                else:
                    otherItems.append(rows)
        print(len(catItems))
        print(len(otherItems))
        # We get 1/4 number of both lists
        num = len(catItems)//4
        totalNum = len(otherItems)//70
        print("NUM:" + str(num))
        print("TOTALNUM:" + str(totalNum))

        catItemsCopy = catItems
        otherItemsCopy = otherItems

        for i in range(nUser,nUser + 20):
            random.shuffle(catItemsCopy)
            catItemsCopy = catItemsCopy[0:num]

            random.shuffle(otherItemsCopy)
            otherItemsCopy = otherItemsCopy[0:totalNum]
            generateGoodRatingsAux(catItemsCopy,i, csvfile_writer)
            generateBadRatingsAux(otherItemsCopy,i, csvfile_writer)
        nUser = nUser + 20
    print("generateRatingsPerCategory")
    print("NUSER: " + str(nUser))
    return nUser


def generateRatingsTestUserAux(user, category, csv_file, csvfile_writer):
    csv_file_copy = csv_file
    catItems = []
    for option in category:
        for rows in csv_file_copy:
            subcategories = rows["subcategories"]
            subcategories = subcategories.split(",")
            #print("SUBCATEGORIES: " + str(subcategories))
            # Separate items in the subcategory and the rest
            for s in subcategories:
                if s == option:
                    catItems.append(rows)

        print(len(catItems))
        # We get 1/4 number of both lists
        num = len(catItems)//4
        print("NUM:" + str(num))

        catItemsCopy = catItems
        random.shuffle(catItemsCopy)
        catItemsCopy = catItemsCopy[0:num]
        generateGoodRatingsAux(catItemsCopy,user, csvfile_writer)



def generateRatingsTestUser(inFile,csvfile_writer):

    for name in csvNames:
        file = inFile + name + ".csv"
        with open(file, mode='r') as csv_file:
            csv_reader = csv.DictReader(csv_file, delimiter=";")
            data = list(csv_reader)
            if name == "restaurants":
                generateRatingsTestUserAux(0,restaurants, data, csvfile_writer)
            elif name == "placesOfInterest":
                generateRatingsTestUserAux(0,placesOfInterest, data, csvfile_writer)
            elif name == "entertainmentEstablishments":
                generateRatingsTestUserAux(0,entertainmentEstablishments, data, csvfile_writer)
            elif name == "accommodation":
                generateRatingsTestUserAux(0,accommodation, data, csvfile_writer)
            elif name == "shops":
                generateRatingsTestUserAux(0,shops, data, csvfile_writer)
            elif name == "museums":
                generateRatingsTestUserAux(0,museums, data, csvfile_writer)
            elif name == "showsHalls":
                generateRatingsTestUserAux(0,showsHalls, data, csvfile_writer)
            elif name == "leisure":
                generateRatingsTestUserAux(0,leisure, data, csvfile_writer)



def generateRatings(inCsv, outCsv):
     # Open CSV
    csvf = open(outCsv + "ratings.csv",'w',encoding='utf-8')
    csvfile_writer = csv.writer(csvf, delimiter=",")
    n = 0
    generateRatingsTestUser(inCsv,csvfile_writer)

    for name in csvNames:
        print("CATEGORY NAME" + name)
        file = inCsv + name + ".csv"
        with open(file, mode='r') as csv_file:
            csv_reader = csv.DictReader(csv_file, delimiter=";")
            data = list(csv_reader)
            print("N: " + str(n))
            if name == "restaurants":
                n = generateRatingsPerCategory(n + 1,restaurants, data, csvfile_writer)
            elif name == "placesOfInterest":
                n = generateRatingsPerCategory(n + 1,placesOfInterest, data, csvfile_writer)
            elif name == "entertainmentEstablishments":
                n = generateRatingsPerCategory(n + 1,entertainmentEstablishments, data, csvfile_writer)
            elif name == "accommodation":
                n = generateRatingsPerCategory(n + 1,accommodation, data, csvfile_writer)
            elif name == "shops":
                n = generateRatingsPerCategory(n + 1,shops, data, csvfile_writer)
            elif name == "museums":
                n = generateRatingsPerCategory(n + 1,museums, data, csvfile_writer)
            elif name == "showsHalls":
                n = generateRatingsPerCategory(n + 1,showsHalls, data, csvfile_writer)
            elif name == "leisure":
                n = generateRatingsPerCategory(n + 1,leisure, data, csvfile_writer)




scriptpath = os.path.dirname(os.path.abspath(__file__))
print("PATH: " +  scriptpath)
path = scriptpath + '/outputData/'

generateRatings(path, path)