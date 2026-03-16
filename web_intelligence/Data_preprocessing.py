# Import necessary libraries for web scraping, data manipulation, and visualization
import requests          # Used to send HTTP requests to websites
from bs4 import BeautifulSoup  # Used for parsing HTML and XML documents
import pandas as pd      # Used for data manipulation and analysis
import matplotlib.pyplot as plt  # Used for creating visualizations

# Define the base URL for the website we want to scrape
# The {} is a placeholder that will be replaced with page numbers
BASE_URL = "https://books.toscrape.com/catalogue/page-{}.html"

# Initialize empty lists to store the scraped data
titles = []      # To store book titles
prices = []      # To store book prices
ratings = []     # To store book ratings

# Print a message to indicate that scraping has started
print("Scrapping Started........\n")

# Loop through pages 1 to 50 to scrape data from multiple pages
for page in range(1, 51):
    # Format the URL with the current page number
    url = BASE_URL.format(page)
    
    # Send a GET request to the URL and store the response
    response = requests.get(url)
    
    # Parse the HTML content using BeautifulSoup
    # 'html.parser' is the built-in Python parser
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find all book elements on the page
    # Each book is contained in an <article> tag with class "product_pod"
    books = soup.find_all("article", class_="product_pod")
    
    # Loop through each book found on the current page
    for book in books:
        # Extract the book title from the <h3> tag's <a> element
        titles.append(book.h3.a["title"])
        
        # Extract the price from the <p> element with class "price_color"
        prices.append(book.find("p", class_="price_color").text)
        
        # Extract the rating from the <p> element with class "star-rating"
        # The rating is stored in the second class name (e.g., "star-rating Three")
        rating_class = book.find("p", class_="star-rating")["class"][1]
        ratings.append(rating_class)

# Print a message to indicate that scraping is complete
print("Scrapping completed!")

# Create a pandas DataFrame from the collected data
# A DataFrame is a 2-dimensional labeled data structure
df = pd.DataFrame({
    "Title": titles,     # Column for book titles
    "Price": prices,     # Column for book prices
    "Rating": ratings    # Column for book ratings
})

# DATA CLEANING

# Clean the Price column by removing currency symbols and keeping only numbers
# This uses regex to replace anything that is not a digit or decimal point with an empty string
df["Price"] = df["Price"].str.replace(r"[^\d.]", "", regex=True)

# Convert the Price column to numeric type 
df["Price"] = pd.to_numeric(df["Price"])

# Create a dictionary to map rating words to numbers
rating_map = {
    "One": 1,
    "Two": 2,
    "Three": 3,
    "Four": 4,
    "Five": 5
}

# Map the textual ratings to numeric values using the dictionary
df["Rating"] = df["Rating"].map(rating_map)

#  DATA STORAGE

# Save the cleaned DataFrame to a CSV file
df.to_csv("books_data.csv", index=False)

#  DATA ANALYSIS

# Calculate and print the average price of all books
# round() is used to limit the result to 2 decimal places
print("\nAverage Price:", round(df["Price"].mean(), 2))

#  DATA VISUALIZATION
# Create a bar chart showing the distribution of book ratings
df["Rating"].value_counts().sort_index().plot(kind="bar")

# Add labels and title to the plot
plt.xlabel("Rating")           # X-axis label
plt.ylabel("Count")           # Y-axis label
plt.title("Distribution of Book Ratings")  # Chart title

# Display the chart
plt.show()

# Print final message indicating program completion
print("\nFinal program completed. Data saved to books_data.csv")