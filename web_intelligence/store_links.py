# Import required libraries
# requests → to send HTTP request and get webpage data
# BeautifulSoup → to parse and extract data from HTML
# csv → to save extracted data into a CSV file
import requests
from bs4 import BeautifulSoup
import csv

# Website URL we want to scrape
url='https://www.mygov.in/'

# Send a request to the website and get the response
response = requests.get(url)

# Parse the HTML content of the page using BeautifulSoup
soup = BeautifulSoup(response.text, 'html.parser')

# Find all anchor (<a>) tags from the webpage
# These tags contain hyperlinks
links = soup.find_all('a')

# Open a CSV file named 'links.csv' in write mode
# newline='' prevents blank rows in Windows
# encoding='utf-8' supports special characters
with open('links.csv', 'w', newline='', encoding='utf-8') as file:

    # Create a CSV writer object
    writer = csv.writer(file)

    # Write the header row in CSV file
    writer.writerow(['Links'])

    # Loop through each link found on the page
    for link in links:

        # Extract the 'href' attribute (actual URL)
        # and write it into the CSV file
        writer.writerow([link.get('href')])

        # Print total number of links saved
print(f"Done! Saved {len(links)} links to links.csv")