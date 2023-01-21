#
#   Script: get items info (not events) from Madrid-> XML to CSV
#   Arguments:
#       1: name of xml and csv file (restaurants, placesOfInterest...)
#       2: name of category (Restaurants, PlacesOfInterest...)
#       3: start id
from xml.etree import ElementTree
import csv
import re
import sys
import os
import requests

allCategories = {}



def getCategories(item):
    result = ""
    cats = item.find("extradata").find("categorias").findall("categoria")
    
    for cat in cats:
        cat = cat.findall("item")
        cat = cat.pop()
        result = result + cat.text + ","
        if cat.text in allCategories:
            i = allCategories.get(cat.text)
            i = i + 1
            allCategories.update({cat.text : i})
        else:
            allCategories.update({cat.text : 1})

    return result



def writeCSVFile(category, xmlfile,csvfile, i):
    CLEANR = re.compile('<.*?>') 

    print(xmlfile)
    print(csvfile)
    # PARSE XML
    xml = ElementTree.parse(xmlfile)

    # CREATE CSV FILE
    csvfile = open(csvfile,'w',encoding='utf-8')
    csvfile_writer = csv.writer(csvfile, delimiter=";")

    # ADD THE HEADER TO CSV FILE
    csvfile_writer.writerow(["id", "title", "author","authorId","description","img", "longitude", "latitude", "begin","ending", "category", "subcategories"])

    author = "DemoEM"
    
    for item in xml.findall("service"):

        if(item):
            # EXTRACT ROWS DETAILS  
            title = item.find("basicData").find("title")
            title = title.text.replace(";",",")

            description = item.find("basicData").find("body")
            print(description.text)
            if description.text != None:
                description = re.sub(CLEANR, '', description.text)
                description =description.replace(";",",")
            else:
                description= ""
            

            img = item.find("multimedia").findall("media")
            if img:
                # We get the last item
                img = img.pop()
                img = img.find("url").text
            else:
                img=""
            
            longitude = item.find("geoData").find("longitude").text
            latitude = item.find("geoData").find("latitude").text

            subcategories = getCategories(item)

            csv_line = [str(i),title, author, str(i), description[:244], img, longitude, latitude, "", "", category, subcategories]
            # ADD A NEW ROW TO CSV FILE
            csvfile_writer.writerow(csv_line)
        i = i+1


def writeCSVFileMuseums(category, xmlfile, csvfile, i):
    CLEANR = re.compile('<.*?>') 

    print(xmlfile)
    print(csvfile)
    # PARSE XML
    xml = ElementTree.parse(xmlfile)

    # CREATE CSV FILE
    csvfile = open(csvfile,'w',encoding='utf-8')
    csvfile_writer = csv.writer(csvfile, delimiter=";")

    # ADD THE HEADER TO CSV FILE
    csvfile_writer.writerow(["id", "title", "author","authorId","description","img", "longitude", "latitude", "begin","ending", "category", "subcategories"])

    author = "DemoEM"
    
    # FOR EACH EMPLOYEE
    title = ""
    description = ""
    cat = ""
    latitude = ""
    longitude = ""

    for item1 in xml.findall("contenido"):
        if item1:
            for item2 in item1.find("atributos").findall("atributo"):
                itemName = item2.attrib['nombre']
                if(itemName == "NOMBRE"):
                    title = item2.text
                
                elif(itemName == "DESCRIPCION-ENTIDAD"):
                    description = item2.text
                
                elif(itemName == "TIPO"):
                    tipo = item2.text
                    tipo = tipo.split("/")
                    cat = tipo.pop()
                    if cat in allCategories:
                        j = allCategories.get(cat)
                        j = j + 1
                        allCategories.update({cat : j})
                    else:
                        allCategories.update({cat : 1})

                elif(itemName == "LOCALIZACION"):
                    for item3 in item2.findall("atributo"):
                        item3Name = item3.attrib['nombre']    
                        if(item3Name == "LATITUD"):
                            latitude = item3.text
                        if(item3Name == "LONGITUD"):
                            longitude = item3.text

        csv_line = [str(i),title, author, str(i), description[:244], "", longitude, latitude, "", "", category, cat]
            # ADD A NEW ROW TO CSV FILE
        csvfile_writer.writerow(csv_line)                
        i = i+1


def writeCSVFileShowsHalls(category, csvfile, i):
    print("hi")
    # CREATE CSV FILE
    csvfile = open(csvfile,'w',encoding='utf-8')
    csvfile_writer = csv.writer(csvfile, delimiter=";")

    #cines, teatros, auditorios/conciertos
    urls = ["https://datos.madrid.es/egob/catalogo/208862-7650164-ocio_salas.json",
            "https://datos.madrid.es/egob/catalogo/208862-7650046-ocio_salas.json",
            "https://datos.madrid.es/egob/catalogo/208862-7650180-ocio_salas.json"]
    
    categories = ["Cinemas",
            "Theatres",
            "Auditoriums/ConcertHalls"]
    headers = headers = {'Accept': 'application/json'}

    # ADD THE HEADER TO CSV FILE
    csvfile_writer.writerow(["id", "title", "author","authorId","description","img", "longitude", "latitude", "begin","ending", "category", "subcategories"])

    author = "DemoEM"
    j = 0
    for url in urls:
        print(url)
        x = requests.get(url=url, headers=headers)
        body = x.json()

        h = 0
        for item in body["@graph"]:
            title = item["title"]
            title = title.replace(";",",")

            organization = item["organization"]
            description = organization["organization-desc"]
            description = description.replace(";",",")

            img = ''
            location = item["location"]
            longitude = location["longitude"]
            latitude = location["latitude"]

            csv_line = [str(i),title, author, str(i), description[:244], "", longitude, latitude, "", "", category, categories[j]]
            # ADD A NEW ROW TO CSV FILE
            csvfile_writer.writerow(csv_line) 
            h = h + 1
            i = i + 1
        allCategories.update({categories[j] : h})
        j = j + 1
        

def writeCSVFileLeisure(category, csvfile, i):
    print("hi")
    # CREATE CSV FILE
    csvfile = open(csvfile,'w',encoding='utf-8')
    csvfile_writer = csv.writer(csvfile, delimiter=";")

    #cines, teatros, auditorios/conciertos
    url = "https://datos.madrid.es/egob/catalogo/206974-0-agenda-eventos-culturales-100.json"

    headers = headers = {'Accept': 'application/json'}

    # ADD THE HEADER TO CSV FILE
    csvfile_writer.writerow(["id", "title", "author","authorId","description","img", "longitude", "latitude", "begin","ending", "category", "subcategories"])

    author = "DemoEM"
    j = 0
    
    x = requests.get(url=url, headers=headers)
    body = x.json()

    for item in body["@graph"]:
        print("TYPE: " )
        print(type(item))
        title = item["title"]
        title = title.replace(";",",")

        description = item["description"]
        description = description.replace(";",",")

        if 'location' in item:
            location = item["location"]
            longitude = location["longitude"]
            latitude = location["latitude"]
        else:
            longitude = 0
            latitude = 0

        if '@type' in item:
            subcat = item["@type"]
            subcat = subcat.split("/")
            subcat = subcat.pop()
        else:
            subcat = "None"
        if subcat in allCategories:
            j = allCategories.get(subcat)
            j = j + 1
            allCategories.update({subcat : j})
        else:
            allCategories.update({subcat : 1})

        begin = item["dtstart"]
        begin = begin.replace(" ", "T") + "Z"
        ending = item["dtend"]
        ending = ending.replace(" ", "T") + "Z"
        csv_line = [str(i),title[:139], author, str(i), description[:244], "", longitude, latitude, begin, ending, category,subcat]
        # ADD A NEW ROW TO CSV FILE
        csvfile_writer.writerow(csv_line) 
        i = i + 1
    


# MAIN
scriptpath = os.path.dirname(os.path.abspath(__file__))
print("PATH: " +  scriptpath)
csvpath = scriptpath + '/outputData/' + sys.argv[1] + '.csv'
xmlpath = scriptpath + '/inputData/' + sys.argv[1] + '.xml'
category = sys.argv[2]

if (category == "Museums"):
    writeCSVFileMuseums(category, xmlpath, csvpath,int(sys.argv[3]))
elif(category == "ShowsHalls"):
    writeCSVFileShowsHalls(category, csvpath,int(sys.argv[3]))
elif(category == "Leisure"):
    writeCSVFileLeisure(category, csvpath,int(sys.argv[3]))
else:
    writeCSVFile(category, xmlpath,csvpath, int(sys.argv[3]))
print("END")
print(allCategories)