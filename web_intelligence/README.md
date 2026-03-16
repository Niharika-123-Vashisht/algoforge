# Web Intelligence Project

Python web crawling with **requests/BeautifulSoup** and **Scrapy**.

## How to open in Cursor / VS Code (important)

To have Run, Debug, and Terminal work correctly:

1. **File → Open Folder** (or **Open Workspace from File**)
2. Open this folder:  
   **`c:\Users\HP\.vscode\web_intelligence`**  
   **Or** open the file:  
   **`web_intelligence.code-workspace`**

Do **not** open the parent folder `c:\Users\HP\.vscode` — that is the editor config folder, not this project. If you open it, Python and Scrapy will not be found.

## Run scripts

- **Run button (top right)** – Run the currently open Python file.
- **F5** – Start Debugging, then choose a configuration (e.g. **Python: web_crawling_scrapy.py**).
- **Terminal → Run Task** – Run **Run: web_crawling_scrapy.py**, **Run: store_links.py**, or **Scrapy: crawl mygov**.

## Python environment

- Virtual environment: **`.venv`** in this folder (has `requests`, `beautifulsoup4`, `scrapy`).
- New terminals in this workspace automatically use this environment.

## Files

| File | Description |
|------|-------------|
| `store_links.py` | Saves mygov.in links to `links.csv` |
| `web_crawling.py` | Fetches a page and prints title + links |
| `web_crawling_scrapy.py` | Scrapy spider (mygov.in), runnable as a script |
| `crawler/` | Scrapy project (run with `scrapy crawl mygov`) |
| `mygov_output.json` | Scrapy output (when using project settings) |
