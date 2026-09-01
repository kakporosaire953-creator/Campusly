import re

with open('dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

comp_start = content.find("      <!-- VUE COMPOSITION -->")
comp_end = content.find('<div class="dash-metrics-grid"', comp_start)

# find the start of the line for comp_end
while comp_end > 0 and content[comp_end-1] in (' ', '\t', '\n'):
    comp_end -= 1

if comp_start != -1 and comp_end != -1:
    comp_block = content[comp_start:comp_end]
    
    # Remove it from the current position
    content = content[:comp_start] + content[comp_end:]
    
    # Now insert it right before VUE EPREUVES (NOUVELLE)
    epreuves_start = content.find("      <!-- VUE EPREUVES (NOUVELLE) -->")
    
    if epreuves_start != -1:
        content = content[:epreuves_start] + comp_block + "\n" + content[epreuves_start:]
        
        with open('dashboard.html', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Fixed structure!")
    else:
        print("Could not find VUE EPREUVES")
else:
    print("Could not find block boundaries")
