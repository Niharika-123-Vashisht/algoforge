# Scrapy settings for crawler project
BOT_NAME = "crawler"
SPIDER_MODULES = ["crawler.spiders"]
NEWSPIDER_MODULE = "crawler.spiders"

# Obey robots.txt (set to False to allow all)
ROBOTSTXT_OBEY = True

# Throttle to be polite to the server
DOWNLOAD_DELAY = 0.5
AUTOTHROTTLE_ENABLED = True

# Save output to JSON when running (override with -o file.json in CLI)
FEEDS = {
    "mygov_output.json": {"format": "json", "encoding": "utf-8"},
}
