import re

html_path = '/Users/gabriel.wsantos/Desktop/GitHub/2026/a-nobreza-do-amor-v2/index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the flex container with the carousel HTML
old_html = """                <div style="display: flex; flex-direction: column; gap: 2rem; align-items: center;">
                    <!-- Elísio Lopes Jr. -->
                    <div class="quote-card glass-light"
                        style="width: 100%; max-width: 800px; padding: 2rem; border-radius: 16px; text-align: left; background-color: var(--beige-1); background-image: url('assets/bg-nucleo-b.webp'); background-size: cover; background-position: center; overflow: hidden; position: relative;">
                        <div
                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(245, 238, 226, 0.9); z-index: 1;">
                        </div>
                        <div style="position: relative; z-index: 2;">
                            <p
                                style="font-size: 1.2rem; font-style: italic; color: var(--dark-1); margin-bottom: 1.5rem;">
                                "A gente define A Nobreza do Amor uma fábula afro-brasileira. Ela tem essa base no
                                diálogo e na troca entre Brasil e África. Vai chegar pelo coração e pelo afeto às
                                pessoas."</p>
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <div>
                                    <strong
                                        style="color: var(--orange-1); display: block; font-size: 1.1rem; text-transform: uppercase;">Elísio
                                        Lopes Jr.</strong>
                                    <span style="color: var(--dark-2); font-size: 0.9rem;">Escritores/Roteiristas</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Duca Rachid -->
                    <div class="quote-card glass-light"
                        style="width: 100%; max-width: 800px; padding: 2rem; border-radius: 16px; text-align: left; background-color: var(--beige-1); background-image: url('assets/bg-nucleo-b.webp'); background-size: cover; background-position: center; overflow: hidden; position: relative;">
                        <div
                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(245, 238, 226, 0.9); z-index: 1;">
                        </div>
                        <div style="position: relative; z-index: 2;">
                            <p
                                style="font-size: 1.2rem; font-style: italic; color: var(--dark-1); margin-bottom: 1.5rem;">
                                "É uma grande novidade ter uma nobreza africana em uma novela. É totalmente inédito.
                                Faltava isso e era um desejo nosso mostrar."</p>
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <div>
                                    <strong
                                        style="color: var(--orange-1); display: block; font-size: 1.1rem; text-transform: uppercase;">Duca
                                        Rachid</strong>
                                    <span style="color: var(--dark-2); font-size: 0.9rem;">Escritores/Roteiristas</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Júlio Fischer -->
                    <div class="quote-card glass-light"
                        style="width: 100%; max-width: 800px; padding: 2rem; border-radius: 16px; text-align: left; background-color: var(--beige-1); background-image: url('assets/bg-nucleo-b.webp'); background-size: cover; background-position: center; overflow: hidden; position: relative;">
                        <div
                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(245, 238, 226, 0.9); z-index: 1;">
                        </div>
                        <div style="position: relative; z-index: 2;">
                            <p
                                style="font-size: 1.2rem; font-style: italic; color: var(--dark-1); margin-bottom: 1.5rem;">
                                "A gente acredita profundamente nessa história e acreditamos que ela vai sensibilizar
                                nosso público e cair no gosto."</p>
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <div>
                                    <strong
                                        style="color: var(--orange-1); display: block; font-size: 1.1rem; text-transform: uppercase;">Júlio
                                        Fischer</strong>
                                    <span style="color: var(--dark-2); font-size: 0.9rem;">Escritores/Roteiristas</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>"""

new_html = """                <!-- CARROSSEL DE CITAÇÕES -->
                <div class="quotes-carousel-wrapper" style="position: relative; max-width: 800px; margin: 0 auto;">
                    
                    <button class="carousel-btn prev-btn" aria-label="Citação anterior" onclick="moveQuoteCarousel(-1)"
                            style="position: absolute; left: -20px; top: 50%; transform: translateY(-50%); z-index: 10; background: var(--gold-1); color: var(--dark-1); border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); transition: all 0.3s ease;">
                        ❮
                    </button>
                    
                    <button class="carousel-btn next-btn" aria-label="Próxima citação" onclick="moveQuoteCarousel(1)"
                            style="position: absolute; right: -20px; top: 50%; transform: translateY(-50%); z-index: 10; background: var(--gold-1); color: var(--dark-1); border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); transition: all 0.3s ease;">
                        ❯
                    </button>

                    <div class="quotes-carousel" style="overflow: hidden; width: 100%; border-radius: 16px;">
                        <div class="quotes-track" id="quotesTrack" style="display: flex; width: 300%; transition: transform 0.5s ease-in-out;">
                            
                            <!-- Elísio Lopes Jr. -->
                            <div class="quote-slide" style="flex: 0 0 33.333%; padding: 0 10px; box-sizing: border-box;">
                                <div class="quote-card glass-light"
                                    style="width: 100%; padding: 2rem; border-radius: 16px; text-align: left; background-color: var(--beige-1); background-image: url('assets/bg-nucleo-b.webp'); background-size: cover; background-position: center; overflow: hidden; position: relative;">
                                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(245, 238, 226, 0.9); z-index: 1;"></div>
                                    <div style="position: relative; z-index: 2;">
                                        <p style="font-size: 1.2rem; font-style: italic; color: var(--dark-1); margin-bottom: 1.5rem;">
                                            "A gente define A Nobreza do Amor uma fábula afro-brasileira. Ela tem essa base no
                                            diálogo e na troca entre Brasil e África. Vai chegar pelo coração e pelo afeto às
                                            pessoas."</p>
                                        <div style="display: flex; align-items: center; gap: 1rem;">
                                            <div>
                                                <strong style="color: var(--orange-1); display: block; font-size: 1.1rem; text-transform: uppercase;">Elísio Lopes Jr.</strong>
                                                <span style="color: var(--dark-2); font-size: 0.9rem;">Escritores/Roteiristas</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Duca Rachid -->
                            <div class="quote-slide" style="flex: 0 0 33.333%; padding: 0 10px; box-sizing: border-box;">
                                <div class="quote-card glass-light"
                                    style="width: 100%; padding: 2rem; border-radius: 16px; text-align: left; background-color: var(--beige-1); background-image: url('assets/bg-nucleo-b.webp'); background-size: cover; background-position: center; overflow: hidden; position: relative;">
                                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(245, 238, 226, 0.9); z-index: 1;"></div>
                                    <div style="position: relative; z-index: 2;">
                                        <p style="font-size: 1.2rem; font-style: italic; color: var(--dark-1); margin-bottom: 1.5rem;">
                                            "É uma grande novidade ter uma nobreza africana em uma novela. É totalmente inédito.
                                            Faltava isso e era um desejo nosso mostrar."</p>
                                        <div style="display: flex; align-items: center; gap: 1rem;">
                                            <div>
                                                <strong style="color: var(--orange-1); display: block; font-size: 1.1rem; text-transform: uppercase;">Duca Rachid</strong>
                                                <span style="color: var(--dark-2); font-size: 0.9rem;">Escritores/Roteiristas</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Júlio Fischer -->
                            <div class="quote-slide" style="flex: 0 0 33.333%; padding: 0 10px; box-sizing: border-box;">
                                <div class="quote-card glass-light"
                                    style="width: 100%; padding: 2rem; border-radius: 16px; text-align: left; background-color: var(--beige-1); background-image: url('assets/bg-nucleo-b.webp'); background-size: cover; background-position: center; overflow: hidden; position: relative;">
                                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(245, 238, 226, 0.9); z-index: 1;"></div>
                                    <div style="position: relative; z-index: 2;">
                                        <p style="font-size: 1.2rem; font-style: italic; color: var(--dark-1); margin-bottom: 1.5rem;">
                                            "A gente acredita profundamente nessa história e acreditamos que ela vai sensibilizar
                                            nosso público e cair no gosto."</p>
                                        <div style="display: flex; align-items: center; gap: 1rem;">
                                            <div>
                                                <strong style="color: var(--orange-1); display: block; font-size: 1.1rem; text-transform: uppercase;">Júlio Fischer</strong>
                                                <span style="color: var(--dark-2); font-size: 0.9rem;">Escritores/Roteiristas</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- Bolinhas de Paginação -->
                    <div class="quotes-dots" id="quotesDots" style="display: flex; justify-content: center; gap: 0.5rem; margin-top: 1.5rem;">
                        <button class="dot active" onclick="jumpToQuote(0)" aria-label="Ir para slide 1" style="width: 12px; height: 12px; border-radius: 50%; border: none; background-color: var(--gold-1); cursor: pointer; transition: opacity 0.3s;"></button>
                        <button class="dot" onclick="jumpToQuote(1)" aria-label="Ir para slide 2" style="width: 12px; height: 12px; border-radius: 50%; border: none; background-color: var(--gold-1); opacity: 0.4; cursor: pointer; transition: opacity 0.3s;"></button>
                        <button class="dot" onclick="jumpToQuote(2)" aria-label="Ir para slide 3" style="width: 12px; height: 12px; border-radius: 50%; border: none; background-color: var(--gold-1); opacity: 0.4; cursor: pointer; transition: opacity 0.3s;"></button>
                    </div>

                </div>

                <script>
                    let currentQuoteIndex = 0;
                    const totalQuotes = 3;

                    function updateQuoteCarousel() {
                        const track = document.getElementById('quotesTrack');
                        const dots = document.querySelectorAll('#quotesDots .dot');
                        
                        // Move a trilha (track) para a esquerda (-33.333% por slide, pois a track tem 300% de largura)
                        const percentage = -(currentQuoteIndex * 33.33333333);
                        track.style.transform = `translateX(${percentage}%)`;
                        
                        // Atualiza as bolinhas (dots)
                        dots.forEach((dot, index) => {
                            if (index === currentQuoteIndex) {
                                dot.style.opacity = '1';
                                dot.classList.add('active');
                            } else {
                                dot.style.opacity = '0.4';
                                dot.classList.remove('active');
                            }
                        });
                    }

                    function moveQuoteCarousel(direction) {
                        currentQuoteIndex += direction;
                        
                        // Loop infinito
                        if (currentQuoteIndex < 0) currentQuoteIndex = totalQuotes - 1;
                        if (currentQuoteIndex >= totalQuotes) currentQuoteIndex = 0;
                        
                        updateQuoteCarousel();
                    }

                    function jumpToQuote(index) {
                        currentQuoteIndex = index;
                        updateQuoteCarousel();
                    }
                </script>"""

if old_html in content:
    content = content.replace(old_html, new_html)
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Substituído com sucesso via script Python!")
    
else:
    print("NÃO ENCONTROU O TEXTO. Vou tentar com Regex.")
    # Fallback to regex replace
    pattern = re.compile(r'<div style="display: flex; flex-direction: column; gap: 2rem; align-items: center;">\s*<!-- Elísio Lopes Jr. -->.*?</div>\s*</div>\s*</div>\s*</div>', re.DOTALL)
    
    if pattern.search(content):
        content = pattern.sub(new_html, content)
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Substituído com sucesso via regex!")
    else:
        print("ERRO TOTA: Nem regex achou.")

