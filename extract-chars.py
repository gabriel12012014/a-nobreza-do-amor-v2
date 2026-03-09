import re
import json

html_path = '/Users/gabriel.wsantos/Desktop/GitHub/2026/a-nobreza-do-amor-v2/index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Split into Batanga and Barro Preto sections
batanga_match = re.search(r'id="nucleo-batanga".*?<ul class="character-grid">(.*?)</ul>', html, re.DOTALL)
barro_preto_match = re.search(r'id="nucleo-barro-preto".*?<ul class="character-grid">(.*?)</ul>', html, re.DOTALL)

def extract_characters(ul_html, nucleo_id):
    chars = []
    # Find all <li> elements
    list_items = re.findall(r'<li class="flip-card">(.*?)</li>', ul_html, re.DOTALL)
    
    for li in list_items:
        # Extract front data
        img_src_match = re.search(r'<img.*?src="(.*?)"', li)
        img_src = img_src_match.group(1) if img_src_match else ""
        
        # If no img, look for placeholder div
        if not img_src:
            img_src = "" # it's a placeholder without image
            
        front_char_name_match = re.search(r'<strong class="char-name">(.*?)</strong>', li)
        front_char_name = front_char_name_match.group(1) if front_char_name_match else ""
        
        front_actor_name_match = re.search(r'<span class="actor-name">(.*?)</span>', li)
        front_actor_name = front_actor_name_match.group(1) if front_actor_name_match else ""
        
        # Extract back data
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

all_chars = []
if batanga_match:
    all_chars.extend(extract_characters(batanga_match.group(1), 'batanga'))
if barro_preto_match:
    all_chars.extend(extract_characters(barro_preto_match.group(1), 'barropreto'))

js_content = "const charactersData = " + json.dumps(all_chars, ensure_ascii=False, indent=4) + ";\n"

with open('/Users/gabriel.wsantos/Desktop/GitHub/2026/a-nobreza-do-amor-v2/characters.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Extracted {len(all_chars)} characters to characters.js")

