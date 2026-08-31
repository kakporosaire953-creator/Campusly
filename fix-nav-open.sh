#!/bin/bash
# Remove the old .nav-links.open block which contains animation
awk '
BEGIN { skip = 0; }
/\.nav-links\.open {/ { skip = 1; print "  .nav-links.open {\n    transform: translateX(0);\n    visibility: visible;\n    box-shadow: 0 0 0 100vw rgba(0,0,0,0.4);\n  }"; next; }
skip == 1 && /}/ { skip = 0; next; }
skip == 1 { next; }
/@keyframes slideInLeft {/ { skip = 2; next; }
skip == 2 && /}/ { skip = 0; next; }
skip == 2 { next; }
{ print $0 }
' css/mobile.css > css/mobile.tmp
mv css/mobile.tmp css/mobile.css
