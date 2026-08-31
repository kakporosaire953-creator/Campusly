#!/bin/bash
for file in index.html forum.html contribuer.html js/epreuves.js; do
  sed -i 's/document.getElementById(..hamburger..)?\.addEventListener(.*open.*);//g' "$file"
done
