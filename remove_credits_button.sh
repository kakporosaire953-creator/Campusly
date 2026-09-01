#!/bin/bash
for file in *.html; do
  awk '
    BEGIN { skip = 0 }
    /<button class="campusly-credits-pill"/ { skip = 1 }
    skip == 1 && /<\/button>/ { skip = 0; next }
    skip == 1 { next }
    { print $0 }
  ' "$file" > "$file.tmp"
  mv "$file.tmp" "$file"
done
