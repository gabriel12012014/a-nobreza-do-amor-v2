import re
import json

html_path = '/Users/gabriel.wsantos/Desktop/GitHub/2026/a-nobreza-do-amor-v2/index.html'
js_path = '/Users/gabriel.wsantos/Desktop/GitHub/2026/a-nobreza-do-amor-v2/characters.js'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Notice the ID is nucleo-barropreto without hyphens in the HTML
barro_preto_match = re.search(r'id="nucleo-barropreto".*?<ul class="character-grid">(.*?)</ul>', html, re.DOTALL)

def extract_characters(ul_html, nucleo_id):
    chars = []
    list_items = re.findall(r'<li class="flip-card">(.*?)</li>', ul_html, re.DOTALL)
    
    for li in list_items:
        img_src_match = re.search(r'<img.*?src="(.*?)"', li)
        img_src = img_src_match.group(1) if img_src_match else ""
        
        front_char_name_match = re.search(r'<strong class="char-name">(.*?)</strong>', li)
        front_char_name = front_char_name_match.group(1) if front_char_name_match else ""
        
        front_actor_name_match = re.search(r'<span class="actor-name">(.*?)</span>', li)
        front_actor_name = front_actor_name_match.group(1) if front_actor_name_match else ""
        
        back_char_name_match = re.search(r'<strong class="char-name-back.*?>(.*?)</strong>', li, re.DOTALL)
        back_char_name = re.sub(r'\s+', ' ', back_char_name_match.group(1).strip()) if back_char_name_match else ""
        
        back_actor_name_match = re.search(r'<span class="actor-name-back.*?>(.*?)</span>', li, re.DOTALL)
        back_actor_name = re.sub(r'\s+', ' ', back_actor_name_match.group(1).strip()) if back_actor_name_match else ""
        
        desc_match = re.search(r'<p class="desc">(.*?)</p>', li, re.DOTALL)
        desc = re.sub(r'\s+', ' ', desc_match.group(1).strip()) if desc_match else ""
        
        front_bg = "bg-teal" if "bg-teal" in li else "bg-gold"
        
        chars.append({
            "nucleoId": nucleo_id,
            "imgSrc": img_src,
            "frontBgClass": front_bg,
            "frontCharName": front_char_name,
            "frontActorName": front_actor_name,
            "backCharName": back_char_name,
            "backActorName": back_actor_name,
            "description": desc
        })
    return chars

if barro_preto_match:
    barro_chars = extract_characters(barro_preto_match.group(1), 'barropreto')
    
    # Read existing JS and append
    with open(js_path, 'r', encoding='utf-8') as f:
        js_content = f.read()
        
    # very simple parsing since we control the JS file format from earlier
    # we know it ends with ];
    js_content = js_content.strip()
    if js_content.endswith('];'):
        # Remove the '];' and add a comma
        js_content = js_content[:-2] + ",\n"
        
        # Format the new characters
        new_chars_json = json.dumps(barro_chars, ensure_ascii=False, indent=4)
        # remove the surrounding brackets so we can just append
        new_chars_json = new_chars_json[1:-1]
        
        js_content += new_chars_json + "\n];\n"
        
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        # Now clean up the HTML
        new_html = html.replace(barro_preto_match.group(0), 'id="nucleo-barropreto" class="nucleo-section">\n                    <h3 class="heading-md text-center mb-md" style="color: var(--gold-3);">Núcleo Barro Preto</h3>\n                    <ul class="character-grid" id="grid-barro-preto"></ul>')
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(new_html)
            
        print(f"Success! Extracted {len(barro_chars)} characters.")
    else:
        print("Error: JS file format wasn't as expected.")
else:
    print("Error: Could not find the HTML section.")

