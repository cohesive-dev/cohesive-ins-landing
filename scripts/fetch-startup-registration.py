"""Refresh public registration-office links from the SBA's six-page directory."""
import concurrent.futures
import datetime
import json
from html.parser import HTMLParser
from pathlib import Path
import urllib.request

BASE = "https://www.sba.gov/counseling/launch-your-business/state-registration-lookup/"


class TableParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_row = False
        self.in_cell = False
        self.cells = []
        self.links = []
        self.text = ""
        self.rows = []

    def handle_starttag(self, tag, attrs):
        if tag == "tr":
            self.in_row, self.cells, self.links = True, [], []
        if self.in_row and tag == "td":
            self.in_cell, self.text = True, ""
        if self.in_row and tag == "a":
            self.links.append(dict(attrs).get("href", ""))

    def handle_data(self, data):
        if self.in_cell:
            self.text += data

    def handle_endtag(self, tag):
        if tag == "td" and self.in_cell:
            self.cells.append(" ".join(self.text.split()))
            self.in_cell = False
        if tag == "tr" and self.in_row:
            if len(self.cells) == 2 and len(self.links) == 1:
                self.rows.append((self.cells[0], self.cells[1], self.links[0]))
            self.in_row = False


def fetch(page):
    url = BASE if page == 1 else f"{BASE}?query-204-page={page}"
    with urllib.request.urlopen(url, timeout=30) as response:
        parser = TableParser()
        parser.feed(response.read().decode())
    return parser.rows


if __name__ == "__main__":
    result = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        for rows in pool.map(fetch, range(1, 7)):
            for name, label, href in rows:
                if not href.startswith(("https://", "http://")):
                    raise ValueError(f"Unexpected registration URL for {name}")
                result[name.lower().replace(" ", "-")] = {"label": label, "href": href}
    if len(result) < 50:
        raise ValueError(f"Incomplete directory: only {len(result)} entries")
    target = Path(__file__).resolve().parents[1] / "lib/guides/registration.json"
    target.write_text(json.dumps({"source": BASE, "checked": datetime.date.today().isoformat(), "states": result}, indent=2) + "\n")
    print(f"Saved {len(result)} registration-office links from the SBA directory.")
