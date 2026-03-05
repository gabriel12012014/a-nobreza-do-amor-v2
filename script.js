document.addEventListener('DOMContentLoaded', () => {

    /* --- Navbar Scroll Effect --- */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- Hero Video: carrega as primeiras partes imediatamente para aparecer logo --- */
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        const source = heroVideo.querySelector('source[data-src]');
        if (source) {
            source.src = source.getAttribute('data-src');
            source.removeAttribute('data-src');
            heroVideo.load();
        }

        // Fade-in o vídeo assim que ele de fato começar a tocar (streaming pronto)
        heroVideo.addEventListener('playing', () => {
            heroVideo.style.opacity = '1';
            // Uma vez que o vídeo começou, o placeholder não deve mais aparecer nos loops
            const heroSection = document.getElementById('hero-section');
            if (heroSection) {
                heroSection.style.backgroundImage = 'none';
                heroSection.style.backgroundColor = '#000';
            }
        }, { once: true });

        heroVideo.play().catch(() => { }); // Tenta tocar o mais rápido possível (streaming)

        let isFadingOut = false;

        heroVideo.addEventListener('timeupdate', () => {
            const duration = heroVideo.duration;
            if (!duration) return;

            if (heroVideo.currentTime >= 4 && !isFadingOut) {
                isFadingOut = true;
                const fadeDuration = duration - heroVideo.currentTime;
                heroVideo.style.transition = `opacity ${fadeDuration}s linear`;
                heroVideo.style.opacity = '0';
            }
        });

        heroVideo.addEventListener('ended', () => {
            setTimeout(() => {
                heroVideo.style.transition = 'opacity 1.5s ease';
                heroVideo.currentTime = 0;
                heroVideo.play();

                setTimeout(() => {
                    heroVideo.style.opacity = '1';
                    isFadingOut = false;
                }, 50);
            }, 2000);
        });
    }

    /* --- Scroll Reveal Animations --- */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    /* --- Characters Tabs Removed --- */

    /* --- Flip Cards Logic --- */
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove 'flipped' from all other cards if you want only one open
            // flipCards.forEach(c => { if(c !== card) c.classList.remove('flipped'); });
            card.classList.toggle('flipped');
        });
    });

    /* --- Curiosities Carousel Drag Logic --- */
    const curiositiesGrid = document.querySelector('.curiosities-grid');
    if (curiositiesGrid) {
        let isDown = false;
        let startX;
        let scrollLeft;

        curiositiesGrid.addEventListener('mousedown', (e) => {
            isDown = true;
            curiositiesGrid.style.cursor = 'grabbing';
            // Disable scroll snapping temporarily while dragging for smoother feel
            curiositiesGrid.style.scrollSnapType = 'none';
            startX = e.pageX - curiositiesGrid.offsetLeft;
            scrollLeft = curiositiesGrid.scrollLeft;
        });

        curiositiesGrid.addEventListener('mouseleave', () => {
            isDown = false;
            curiositiesGrid.style.cursor = 'grab';
            curiositiesGrid.style.scrollSnapType = 'x mandatory';
        });

        curiositiesGrid.addEventListener('mouseup', () => {
            isDown = false;
            curiositiesGrid.style.cursor = 'grab';
            curiositiesGrid.style.scrollSnapType = 'x mandatory';
        });

        curiositiesGrid.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - curiositiesGrid.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast multiplier
            curiositiesGrid.scrollLeft = scrollLeft - walk;
        });

        // Initial cursor style
        curiositiesGrid.style.cursor = 'grab';

        // Listen for carousel buttons
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                // Scroll 1 card on mobile (< 768px), 3 cards on desktop
                const scrollAmount = window.innerWidth <= 768 ? 324 : 324 * 3;
                curiositiesGrid.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            });

            nextBtn.addEventListener('click', () => {
                const scrollAmount = window.innerWidth <= 768 ? 324 : 324 * 3;
                curiositiesGrid.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            });
        }
    }

    /* --- Countdown Timer Logic --- */
    function initCountdown() {
        // Target Date: March 16, 2026 at 18:00 (6:00 PM) BrT (UTC-3)
        // Since the current timezone is UTC-3 according to context, we can construct the date directly.
        const targetDate = new Date('March 16, 2026 18:00:00').getTime();

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        const countdownContainer = document.getElementById('countdown');

        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                // The premiere has passed
                countdownContainer.innerHTML = '<h3 class="heading-sm clr-gold" style="margin-top: 1rem;">Estreia Agora!</h3>';
                clearInterval(countdownInterval);
                return;
            }

            // Time calculations for days, hours, minutes and seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Output the result in elements with formatting (pad with 0)
            daysEl.innerText = days.toString().padStart(2, '0');
            hoursEl.innerText = hours.toString().padStart(2, '0');
            minutesEl.innerText = minutes.toString().padStart(2, '0');
            secondsEl.innerText = seconds.toString().padStart(2, '0');
        }

        // Update initially
        updateCountdown();

        // Update every 1 second
        const countdownInterval = setInterval(updateCountdown, 1000);
    }
    initCountdown();

    /* --- Video Carousel Logic --- */
    const videoSlides = document.querySelectorAll('.video-slide');
    const videoDots = document.querySelectorAll('.video-dot');
    const prevVideoBtn = document.querySelector('.prev-video-btn');
    const nextVideoBtn = document.querySelector('.next-video-btn');
    let currentVideoIndex = 0;

    function updateVideoCarousel(index) {
        // Stop current video from playing using postMessage API instead of reloading
        videoSlides.forEach(slide => {
            const iframe = slide.querySelector('iframe');
            if (iframe) {
                iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            }
            slide.style.display = 'none';
        });

        videoDots.forEach(dot => {
            dot.classList.remove('active');
            dot.style.backgroundColor = 'white';
            dot.style.opacity = '0.5';
        });

        videoSlides[index].style.display = 'flex';
        videoDots[index].classList.add('active');
        videoDots[index].style.backgroundColor = 'var(--gold-3)';
        videoDots[index].style.opacity = '1';
    }

    if (prevVideoBtn && nextVideoBtn && videoSlides.length > 0) {
        prevVideoBtn.addEventListener('click', () => {
            currentVideoIndex = (currentVideoIndex - 1 + videoSlides.length) % videoSlides.length;
            updateVideoCarousel(currentVideoIndex);
        });

        nextVideoBtn.addEventListener('click', () => {
            currentVideoIndex = (currentVideoIndex + 1) % videoSlides.length;
            updateVideoCarousel(currentVideoIndex);
        });

        videoDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                currentVideoIndex = parseInt(e.target.getAttribute('data-index'));
                updateVideoCarousel(currentVideoIndex);
            });
        });
    }

});

// Poll Logic
const pollApiUrl = "https://script.google.com/macros/s/AKfycbw-RjDCoitlz4Cg08Zvfo3qzLeakBqIFwMG1rmApg9ypvIsWcmstCMhbeQrrEzaJGsP2w/exec";
let hasVoted = localStorage.getItem('alikaPollVoted');

function submitPoll(choice) {
    if (hasVoted) return;

    const buttons = document.querySelectorAll('.poll-option');
    const messageEl = document.getElementById('poll-message');

    // Disable buttons instantly
    buttons.forEach(btn => btn.disabled = true);
    messageEl.style.display = 'block';
    messageEl.innerText = "Registrando seu voto...";

    fetch(pollApiUrl, {
        method: 'POST',
        // O modo 'no-cors' não permite ler o JSON de resposta num App Script gratuito sem configurações extras,
        // mas envia o dado (o POST). Vamos usar texto simples para o body para mitigar issues de CORS iniciais no fetch simples.
        body: JSON.stringify({ vote: choice })
    })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                updatePollUI(data.trono, data.amor);
                localStorage.setItem('alikaPollVoted', 'true');
                // Salvando também em cache local os últimos valores no caso de reload da página
                localStorage.setItem('cachedVotesTrono', data.trono);
                localStorage.setItem('cachedVotesAmor', data.amor);
                hasVoted = true;
                messageEl.innerText = "Obrigado por votar!";
            } else {
                throw new Error(data.message || 'Erro desconhecido');
            }
        })
        .catch(err => {
            console.error("Erro ao votar", err);
            messageEl.innerText = "Houve um erro. Tente novamente.";
            buttons.forEach(btn => btn.disabled = false);
        });
}

function updatePollUI(tronoVotes, amorVotes) {
    const total = tronoVotes + amorVotes;
    if (total === 0) return;

    const pctTrono = Math.round((tronoVotes / total) * 100);
    const pctAmor = 100 - pctTrono; // Garante que a soma é 100%

    // Só mostra o resultado se o usuário já tiver votado
    if (hasVoted) {
        document.getElementById('composed-bar-container').style.display = 'flex';

        document.getElementById('composed-bar-trono').style.width = pctTrono + '%';
        document.getElementById('pct-trono').innerText = pctTrono + '%';

        document.getElementById('composed-bar-amor').style.width = pctAmor + '%';
        document.getElementById('pct-amor').innerText = pctAmor + '%';
    }

    // Se já votou, desabilita os botões para não clicar de novo
    if (hasVoted) {
        document.querySelectorAll('.poll-option').forEach(btn => {
            btn.style.cursor = 'default';
            btn.disabled = true;
        });
    }
}

// Ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    // Tenta buscar os dados mais atualizados assim que entra na página
    fetch(pollApiUrl)
        .then(res => res.json())
        .then(data => {
            if (data.status === "success" && (data.trono > 0 || data.amor > 0)) {
                // Salva os valores atualizados em cache
                localStorage.setItem('cachedVotesTrono', data.trono);
                localStorage.setItem('cachedVotesAmor', data.amor);

                // Se já votou antes, já atualiza as barras silenciosamente e exibe a barra
                if (hasVoted) {
                    updatePollUI(data.trono, data.amor);
                }
            }
        })
        .catch(err => console.error("Erro ao carregar votos via API", err));

    // Enquanto o fetch acima pensa, se o usuário já votou, exibe imediatamente pelo cache
    if (hasVoted) {
        let votesTrono = parseInt(localStorage.getItem('cachedVotesTrono') || '0');
        let votesAmor = parseInt(localStorage.getItem('cachedVotesAmor') || '0');
        if (votesTrono > 0 || votesAmor > 0) {
            updatePollUI(votesTrono, votesAmor);
        }
    }
});