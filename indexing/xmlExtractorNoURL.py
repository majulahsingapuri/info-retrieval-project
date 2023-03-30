import xml.etree.ElementTree as ET
import csv


tree = ET.parse('file.xml')
root = tree.getroot()

# Open a CSV file for writing the extracted data
with open('car_data.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    # Write the header row
    writer.writerow(['Year', 'Make', 'Model'])  

    for car in root.findall('.//car'):
        year = car.find('year').text
        make = car.find('make').text
        model = car.find('model').text
        # Write the data row
        writer.writerow([year, make, model])  

print("Data written to car_data.csv")
