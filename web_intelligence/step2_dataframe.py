import pandas as pd
import requests

# Import BeautifulSoup to read and extract information from HTML
from bs4 import BeautifulSoup

# Website URL (page number will change)
BASE_URL = "https://books.toscrape.com/catalogue/page-{}.html"

# Lists to store book titles and prices
titles = []
prices = []

for page in range(1, 3):  # scrape 2 pages
    url = BASE_URL.format(page)
    
    # Send request to the website
    response = requests.get(url)
    
    # If the page is not found, it will show an error
    response.raise_for_status()
    
    # Convert page content into readable format
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find all books on the page
    books = soup.find_all('article', class_='product_pod')
    for book in books:
        # Add book title to the list
        titles.append(book.h3.a['title'])
        
        # Add book price to the list
        prices.append(book.find('p', class_='price_color').text)

df = pd.DataFrame(
    {
        "Title": titles,
        "Price": prices,
    }
)
print(df.head())
