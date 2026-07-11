#!/usr/bin/env python3
"""Build index.html for IM Toolkit.

Combines the app shell (template.html — never regenerate this, it contains
all the bug fixes) with your notes data (bundle.json — regenerate this from
your Obsidian vault whenever your notes change).

Usage:  python3 build.py
Output: index.html (upload this to GitHub)
"""
import json, sys, datetime

TEMPLATE = "template.html"
DATA = "bundle.json"
OUT = "index.html"

MARKER = "const BUNDLE = /*INJECT_DATA*/"
PLACEHOLDER = '{"generated":"","count":0,"notes":[],"res":{},"catOrder":[]}'

template = open(TEMPLATE, encoding="utf-8").read()
raw = open(DATA, encoding="utf-8").read()

# validate the data before injecting
data = json.loads(raw)
for key in ("notes", "res", "catOrder"):
    if key not in data:
        sys.exit(f"ERROR: bundle.json is missing the '{key}' key")
data["count"] = len(data["notes"])
if not data.get("generated"):
    data["generated"] = datetime.date.today().isoformat()

needle = MARKER + PLACEHOLDER
if needle not in template:
    sys.exit("ERROR: placeholder not found in template.html — do not edit that line")

out = template.replace(needle, MARKER + json.dumps(data, ensure_ascii=False))
open(OUT, "w", encoding="utf-8").write(out)
print(f"OK: wrote {OUT} ({len(out):,} bytes, {data['count']} notes, build {data['generated']})")
