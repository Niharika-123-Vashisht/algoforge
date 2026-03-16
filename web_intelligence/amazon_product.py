# Selenium used to help in crawling if any website blocks crawling due to privacy policy
# and also used for automated testing like unit and blackbox testing

import time
import csv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service   # Service open website and crawling the data
from selenium.webdriver.chrome.options import Options   # Options means chrome settings support browser features
from webdriver_manager.chrome import ChromeDriverManager


def scrape_amazon(search_query):   # search_query for multiple data then filter out different kind of data or divide database
    
    # Setup chrome options
    chrome_options = Options()
    chrome_options.add_argument("--start-maximized")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    # Create driver  automatically install chrome then activate for this code
    driver = webdriver.Chrome(service=service,
     options=chrome_options)
    service = Service(ChromeDriverManager().install())


    # Open Amazon search page  serach_query you serach which product then show that url for particular product
    url = f"https://www.amazon.com/s?k={search_query}"
    driver.get(url)

    # Wait for page to load Open chrome then activate 5 second
    time.sleep(5)
     
     #Find product then url path also change then find differnt kind of product and scape data
    products = driver.find_elements(By.XPATH, '//div[@data-component-type="s-search-result"]')

    data = []

    for product in products:
        try:
            title = product.find_element(By.TAG_NAME, "h2").text     #title under the h2 tag
        except:
            title = "N/A"                 #If title is not availble then generate N/A

        try:
            link = product.find_element(By.TAG_NAME, "a").get_attribute("href")
        except:
            link = "N/A"

        try:
            rating = product.find_element(By.XPATH, './/span[@class="a-icon-alt"]').text
        except:
            rating = "N/A"

        try:
            whole = product.find_element(By.CLASS_NAME, "a-price-whole").text
            fraction = product.find_element(By.CLASS_NAME, "a-price-fraction").text
            price = whole + fraction
        except:
            price = "N/A"

        data.append([title, rating, price, link])    

        print("Title:", title)
        print("Rating:", rating)
        print("Price:", price)
        print("Link:", link)
        print("-" * 80)        #data gather......check parameter and iteration

    driver.quit()         #after target thenn driver quit

    with open("Products_amazon.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Title", "Rating", "Price", "Link"])
        writer.writerows(data)

    print("Data Saved to Products_amazon.csv")


if __name__ == "__main__":
    search = input("Enter product to search: ")
    scrape_amazon(search)    #Scarpe amazon is function