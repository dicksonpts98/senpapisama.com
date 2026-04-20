#!/usr/bin/env python3
"""Minimal static server for the portfolio. Chdir first to avoid getcwd sandbox issues."""
import os, sys
SITE_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(SITE_DIR)
from http.server import HTTPServer, SimpleHTTPRequestHandler
PORT = 8000
httpd = HTTPServer(("127.0.0.1", PORT), SimpleHTTPRequestHandler)
print(f"Serving {SITE_DIR} at http://127.0.0.1:{PORT}/")
sys.stdout.flush()
httpd.serve_forever()
