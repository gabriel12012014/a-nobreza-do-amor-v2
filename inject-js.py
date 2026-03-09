import re

html_path = '/Users/gabriel.wsantos/Desktop/GitHub/2026/a-nobreza-do-amor-v2/index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace Batanga Grid
html = re.sub(r'id="nucleo-batanga".*?<ul class="character-grid">.*?</ul>', 'id="nucleo-batanga" class="nucleo-section">\n                    <h3 class="heading-md text-center mb-md" style="color: var(--gold-3);">Núcleo Batanga</h3>\n                    <ul class="character-grid" id="grid-batanga"></ul>', html, flags=re.DOTALL)

# Replace Barro Preto Grid
html = re.sub(r'id="nucleo-barro-preto".*?<ul class="character-grid">.*?</ul>', 'id="nucleo-barro-preto" class="nucleo-section">\n                    <h3 class="heading-md text-center mb-md" style="color: var(--gold-3);">Núcleo Barro Preto</h3>\n                    <ul class="character-grid" id="grid-barro-preto"></ul>', html, flags=re.DOTALL)

# Insert the script tags before closing body
script_tag = """
    <!-- Carregar dados dos personagens -->
    <script src="characters.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const renderCharacters = (nucleoId, containerId) => {
                const container = document.getElementById(containerId);
                if (!container || typeof charactersData === 'undefined') return;
                
                const chars = charactersData.filter(c => c.nucleoId === nucleoId);
                
                let html = '';
                chars.forEach(char => {
                    // Check if it's the placeholder without image
                    let imgHtml = '';
                    if (char.imgSrc) {
                        imgHtml = `<img class="card-img-placeholder" src="${char.imgSrc}" loading="lazy" alt="Personagem" style="object-fit: cover;">`;
                    } else {
                        imgHtml = `<div class="card-img-placeholder" style="background-color: #111;"></div>`;
                    }

                    html += `
                        <li class="flip-card">
                            <div class="flip-card-inner">
                                <div class="flip-card-front ${char.frontBgClass}">
                                    <div class="card-frame card-frame-front"></div>
                                    <div class="card-frame card-frame-front"></div>
                                    ${imgHtml}
                                    <div class="card-name-overlay">
                                        <strong class="char-name">${char.frontCharName}</strong>
                                        <span class="actor-name">${char.frontActorName}</span>
                                    </div>
                                </div>
                                <div class="flip-card-back bg-dark" style="background-color: transparent !important;">
                                    <div class="card-frame card-frame-back"></div>
                                    <strong class="char-name-back mb-sm" style="color: var(--gold-3); font-family: 'forevs', sans-serif; font-size: 1.6rem; text-transform: uppercase;">
                                        ${char.backCharName}
                                    </strong>
                                    <span class="actor-name-back mb-md" style="color: white; font-size: 1.1rem; margin-bottom: 1rem;">
                                        ${char.backActorName}
                                    </span>
                                    <p class="desc">${char.description}</p>
                                </div>
                            </div>
                        </li>
                    `;
                });
                container.innerHTML = html;
            };

            renderCharacters('batanga', 'grid-batanga');
            renderCharacters('barropreto', 'grid-barro-preto');
        });
    </script>
</body>"""

html = html.replace('</body>', script_tag)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Injeção feita.")
