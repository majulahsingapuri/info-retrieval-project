import requests
#pip install bs4
from bs4 import BeautifulSoup
import csv

url = 'https://archive.ics.uci.edu/ml/datasets/opinrank+review+dataset'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# Open a CSV file for writing the extracted data
with open('car_data.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    # Write the header row
    writer.writerow(['Year', 'Make', 'Model'])  

    for car in soup.find_all('div', class_='car'):
        year = car.find('span', class_='year').text
        make = car.find('span', class_='make').text
        model = car.find('span', class_='model').text
        # Write the data row
        writer.writerow([year, make, model])  

print("Data written to car_data.csv")
