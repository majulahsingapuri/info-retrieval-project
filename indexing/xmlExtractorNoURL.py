import xml.etree.ElementTree as ET
import pandas as pd

tree = ET.parse('car_data.xml')
root = tree.getroot()

car_data = []

for car in root.findall('.//car'):
    year = car.find('year').text
    manufacturer = car.find('manufacturer').text
    model = car.find('model').text
    car_data.append({'Year': year, 'Manufacturer': manufacturer, 'Model': model})

df = pd.DataFrame(car_data)

# Write the DataFrame to a new CSV file
df.to_csv('car_data.csv', index=False)

