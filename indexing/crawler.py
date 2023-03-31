import requests
from bs4 import BeautifulSoup
from dateutil.parser import parse
import pandas as pd
from typing import Optional
import re

def scrape_car_reviews(manufacturer: str, model: str, year: int) -> Optional[pd.DataFrame]:
    # Replace the spaces and dashes 
    model = model.replace(" ", "_")                             #.replace("-", "_")
    model = model.replace("-", "_")
    manufacturer = manufacturer.replace(" ", "_")               #.replace("-", "_")
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
        title = container.find("h3", class_="sds-heading--7").text.strip()
        
        ###########################################################################
        
        # Find the author data of the review
        author_data = container.find(class_="review-byline")
        author_data = author_data.find_all("div")

        # Find date
        date = parse(author_data[0].text.strip())

        ###########################################################################

        # Find regular expression pattern and search for match string
        author_regex = re.compile(r"By (.+?)")
        author_match = author_regex.search(author_data[1].text.strip())
        author = author_match.group(1)

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
    
    df = pd.DataFrame.from_records(review_data)
    # print(df)
    return df

# scrape_car_reviews("honda", "hr-v", 2020)
