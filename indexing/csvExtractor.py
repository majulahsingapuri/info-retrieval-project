import csv
import requests
from bs4 import BeautifulSoup

def crawler(csv_file):
    with open(csv_file, 'r') as f:
        reader = csv.reader(f)
        next(reader)
        for row in reader:
            url = row[0]
            try:
                response = requests.get(url)
            except requests.exceptions.RequestException as e:
                    print(f'Error fetching {url}: {e}')
                    continue

            soup = BeautifulSoup(response.content, 'html.parser')

            #information extraction
            car_user = soup.find('div', {'class': 'car-user'}).text.strip()
            car_brand = soup.find('div', {'class': 'car-brand'}).text.strip()
            comments = []
            for comment in soup.find_all('div', {'class': 'comment'}):
                text = comment.find('div', {'class': 'comment-text'}).text.strip()
                rating = comment.find('div', {'class': 'comment-rating'}).text.strip()
                author = comment.find('div', {'class': 'comment-author'}).text.strip()
                comments.append({'text': text, 'rating': rating, 'author': author})

            
            author = soup.find('div', {'class': 'author'}).text.strip() if soup.find('div', {'class': 'author'}) else ''

            # save the results to a file or database
            

if __name__ == '__main__':
    csv_file = 'car_urls.csv'
    crawler(csv_file)