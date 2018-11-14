#!/usr/bin/env python

# Usage:
#   $ make-sitemap.py > sitemap.txt
#
# You must mount 'baas-manual' dir before use this.

from pathlib import Path
import re

p = Path(".")
paths = list(p.glob("**/*"))

pattern = re.compile(r'.*\.(html?|pdf)')
excludes = re.compile(r'.*(_layouts\/|\/versions\/).*')

for path in paths:
    path = str(path)
    if pattern.match(path) and not excludes.match(path):
        url = "https://nec-baas.github.io/" + path
        print(url)

