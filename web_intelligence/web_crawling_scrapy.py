# Import required libraries

import scrapy  # Main Scrapy library for web scraping
from urllib.parse import urljoin  # Helps convert relative links to full URLs
from scrapy.crawler import CrawlerProcess  # Used to run spider from Python file
from scrapy.utils.project import get_project_settings  # Loads Scrapy project settings


# -------------------------------------------------------
# Define Spider Class
# -------------------------------------------------------
class MygovSpider(scrapy.Spider):
    
    # Name of the spider (used when running spider)
    name = "mygov"
    
    # Allowed domain (spider will not crawl outside this website)
    allowed_domains = ["mygov.in"]
    
    # Starting page (first page spider will visit)
    start_urls = ["https://www.mygov.in/"]

    # Set to keep track of visited URLs (avoid duplicate crawling)
    visited_urls = set()

    # -------------------------------------------------------
    # Main parse function (called automatically for each page)
    # -------------------------------------------------------
    def parse(self, response):

        # 1️⃣ Avoid visiting same page again
        if response.url in self.visited_urls:
            return
        self.visited_urls.add(response.url)

        # ---------------------------------------------------
        # 2️⃣ Extract Page Title
        # ---------------------------------------------------
        # Gets text inside <title> tag
        title = response.css("title::text").get()

        # ---------------------------------------------------
        # 3️⃣ Extract All Paragraph Text
        # ---------------------------------------------------
        # Gets all text inside <p> tags
        paragraphs = response.css("p::text").getall()

        # ---------------------------------------------------
        # 4️⃣ Extract All Internal Links
        # ---------------------------------------------------
        # Get all href values from <a> tags
        links = response.css("a::attr(href)").getall()
        internal_links = []

        for link in links:
            
            # Convert relative URL to full absolute URL
            absolute_link = urljoin(response.url, link)

            # Check if link belongs to mygov.in (internal link)
            if "mygov.in" in absolute_link:
                internal_links.append(absolute_link)

                # Send request to crawl that internal page
                yield scrapy.Request(absolute_link, callback=self.parse)

        # ---------------------------------------------------
        # 5️⃣ Extract All Forms
        # ---------------------------------------------------
        forms_data = []

        # Select all <form> tags
        forms = response.css("form")

        for form in forms:
            
            # Get form action (where form sends data)
            form_action = form.css("::attr(action)").get()
            
            # Get form method (GET or POST)
            method = form.css("::attr(method)").get()

            # Get all input field names inside the form
            inputs = form.css("input::attr(name)").getall()

            # Store form details in dictionary
            forms_data.append({
                "action": form_action,
                "method": method,
                "inputs": inputs
            })

        # ---------------------------------------------------
        # 6️⃣ Return (Yield) Extracted Data
        # ---------------------------------------------------
        yield {
            "url": response.url,
            "title": title,
            "paragraphs": paragraphs,
            "internal_links": internal_links,
            "forms": forms_data
        }


# -------------------------------------------------------
# Run Spider Automatically When File is Executed
# -------------------------------------------------------
if __name__ == "__main__":
    import os

    # Change working directory to project root
    # (Important so Scrapy finds scrapy.cfg file)
    project_root = os.path.dirname(os.path.abspath(__file__))
    os.chdir(project_root)

    # Create crawler process using project settings
    process = CrawlerProcess(get_project_settings())

    # Start crawling using MygovSpider
    process.crawl(MygovSpider)

    # Start the spider
    process.start()
