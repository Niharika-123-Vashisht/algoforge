# Import required libraries
# requests → to send request to website
# BeautifulSoup → to read and extract data from HTML
import requests
from bs4 import BeautifulSoup

# 1️⃣ Website URL that we want to scrape
url = 'https://www.skills.google/games/6983'

# 2️⃣ Send a GET request to the website
# This asks the server to send the webpage data
response = requests.get(url)

# 3️⃣ Check if the request was successful
# Status code 200 means "OK" (page loaded successfully)
if response.status_code == 200:
    
    # 4️⃣ Parse the HTML content using BeautifulSoup
    # 'html.parser' helps Python understand the HTML structure
    soup = BeautifulSoup(response.text, 'html.parser')

    # 5️⃣ Extract and print the title of the webpage
    # soup.title.text gets the text inside <title> tag
    print("Title of the page:", soup.title.text)

    # 6️⃣ Find all anchor (<a>) tags in the webpage
    # <a> tags contain hyperlinks
    links = soup.find_all('a')

    # 7️⃣ Loop through each link and print its URL
    for link in links:
        # link.get('href') extracts the URL inside href attribute
        print(link.get('href'))

else:
    # If status code is not 200, show error message
    print("Failed to retrieve the webpage. Status code:", response.status_code)
