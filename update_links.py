import re

with open('index.html', 'r') as f:
    content = f.read()

# Prefix to add
prefix = "https://s3.glbimg.com/v1/AUTH_e03f7a1106bb438e970511f892f07c35/gshow/2026/a-nobreza-do-amor/"

# Replace href="styles.css"
content = re.sub(r'href="styles\.css"', f'href="{prefix}styles.css"', content)

# Replace src="script.js"
content = re.sub(r'src="script\.js"', f'src="{prefix}script.js"', content)

# Replace href="assets/...
content = re.sub(r'href="assets/', f'href="{prefix}assets/', content)

# Replace src="assets/...
content = re.sub(r'src="assets/', f'src="{prefix}assets/', content)

with open('index.html', 'w') as f:
    f.write(content)
