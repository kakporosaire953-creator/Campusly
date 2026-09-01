import re

with open('dashboard.html', 'r', encoding='utf-8') as f:
    text = f.read()

emojis = re.findall(r'[^\w\s,\.\-;:_!\?"\'\(\)\[\]\{\}<>\/\\=\+\*&\^%\$#@`~\|]', text)
print(set(emojis))
