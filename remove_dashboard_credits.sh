#!/bin/bash
awk '
  BEGIN { skip = 0 }
  /<!-- Campusly Credits -->/ { skip = 1 }
  skip == 1 && /<\/div>/ {
    div_count++
    if (div_count == 3) {
      skip = 0
      div_count = 0
      next
    }
  }
  skip == 1 { next }
  { print $0 }
' dashboard.html > dashboard.tmp
mv dashboard.tmp dashboard.html
