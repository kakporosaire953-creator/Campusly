import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

emojis = re.findall(r'[^\w\s,\.\-;:_!\?"\'\(\)\[\]\{\}<>\/\\=\+\*&\^%\$#@`~\|]', text)
print(set(emojis))
