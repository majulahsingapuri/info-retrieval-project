import requests
from bs4 import BeautifulSoup
import re
import csv

def scrape_car_reviews(manufacturer, model, year):
    # Replace the spaces and dashes 
    model = model.replace(" ", "_")                 #.replace("-", "_")
    model = model.replace("-", "_")
    manufacturer = manufacturer.replace(" ", "_")                 #.replace("-", "_")
    manufacturer = manufacturer.replace("-", "_")
    
    # Construct the URL 
    url = f"https://www.cars.com/research/{manufacturer}-{model}-{year}/consumer-reviews/?page_size=200"
    


    # Send a request to the URL and get the response
    response = requests.get(url)
    # Status Checking (Can deleted)
    if response.status_code != 200:
        print(f"Error: Request failed with status code {response.status_code}")
        return
    # Parser generated
    soup = BeautifulSoup(response.text, "html.parser")
    
    # Find consumer review containers
    review_containers = soup.find_all(class_="consumer-review-container")
    
    # Dictionaries to store
    review_data = []
    
    for container in review_containers:

        # Find the title of the review
        title = container.find(class_="review-card-header__title").text.strip()
        
        ###########################################################################
        
        # Find the author of the review
        author_data = container.find(class_="review-card-header__byline").text.strip()

        # Find regular expression pattern and search for match string
        author_regex = re.compile(r"By (.+?) on")
        author_match = author_regex.search(author_data)
        author = author_match.group(1)

        ##########################################################################

        # Find the date of the review
        date_data = container.find(class_="review-card-header__date").text.strip()               # maybe use author_data

        # Find regular expression pattern and search for match string
        date_regex = re.compile(r"on (.+)$")
        date_match = date_regex.search(date_data)
        date = date_match.group(1)

        ##########################################################################
        
        # Find the content of the review
        content = container.find("p").text.strip()

        ##########################################################################
        
        # Store data into dictionary
        review_data.append({
            "Title": title,
            "Author": author,
            "Date": date,
            "Content": content
        })
    
    # Write the extracted data to a new CSV file
    with open(f"{manufacturer}_{model}_{year}_reviews.csv", "w", newline="") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=["Title", "Author", "Date", "Content"])
        writer.writeheader()
        # writer = csv.writer(csvfile)
        writer.writerows(review_data)

        #writer.writerow([title, author, date, content])
        
    print(f"Data written to {manufacturer}_{model}_{year}_reviews.csv")


#Example usage: scrape_car_reviews("nissan", "gtr", "2015")
