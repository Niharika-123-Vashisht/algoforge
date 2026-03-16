import scrapy
from urllib.parse import urljoin


class MygovSpider(scrapy.Spider):
    name = "mygov"
    allowed_domains = ["mygov.in"]
    start_urls = ["https://www.mygov.in/"]

    visited_urls = set()

    def parse(self, response):
        # Avoid visiting same page again
        if response.url in self.visited_urls:
            return
        self.visited_urls.add(response.url)

        # 1. Extract Page Title
        title = response.css("title::text").get()

        # 2. Extract All Paragraph Text
        paragraphs = response.css("p::text").getall()

        # 3. Extract All Internal Links
        links = response.css("a::attr(href)").getall()
        internal_links = []

        for link in links:
            absolute_link = urljoin(response.url, link)

            if "mygov.in" in absolute_link:
                internal_links.append(absolute_link)
                yield scrapy.Request(absolute_link, callback=self.parse)

        # 4. Extract All Forms
        forms_data = []
        forms = response.css("form")

        for form in forms:
            form_action = form.css("::attr(action)").get()
            method = form.css("::attr(method)").get()
            inputs = form.css("input::attr(name)").getall()

            forms_data.append({
                "action": form_action,
                "method": method,
                "inputs": inputs
            })

        # 5. Yield Data
        yield {
            "url": response.url,
            "title": title,
            "paragraphs": paragraphs,
            "internal_links": internal_links,
            "forms": forms_data
        }
