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
        const prevBtn = document.querySelector('.prev-curiosity-btn');
        const nextBtn = document.querySelector('.next-curiosity-btn');

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

    /* --- GloboPlayer Logic --- */
    function initGloboPlayers() {
        const players = document.querySelectorAll('.globo-player');
        if (players.length === 0) return;

        const initializePlayer = (container) => {
            if (container.hasAttribute('data-player-initialized')) return;
            const videoId = container.getAttribute('data-video-id');
            if (!videoId) return;

            container.setAttribute('data-player-initialized', 'true');
            container.innerHTML = '';

            const playerInstance = new window.WM.Player({
                videosIDs: videoId,
                width: "100%",
                height: "100%",
                autoPlay: true,
                muted: true,
                skipDFP: true,
                loop: true,
            });
            playerInstance.attachTo(container);
            container.wmPlayerInstance = playerInstance;

            // Overlay para ligar o som ao primeiro clique (Tap to Unmute)
            const overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.zIndex = '10';
            overlay.style.cursor = 'pointer';

            overlay.addEventListener('click', () => {
                try { playerInstance.unmute(); } catch (e) { }
                try { playerInstance.setVolume(1); } catch (e) { }
                try { playerInstance.muted = false; } catch (e) { }
                overlay.remove();
            });

            container.style.position = 'relative';
            container.appendChild(overlay);
        };

        const setupObserver = () => {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    // Quando o threshold é atingido, inicializa e dá autoPlay
                    if (entry.isIntersecting) {
                        initializePlayer(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.25 });

            players.forEach(p => observer.observe(p));
        };

        const checkPlayerReady = () => {
            if (typeof window.WM !== "undefined" && window.WM.playerAvailable) {
                window.WM.playerAvailable.then(setupObserver);
            } else if (typeof window.WM !== "undefined" && window.WM.Player) {
                setupObserver();
            } else {
                setTimeout(checkPlayerReady, 100);
            }
        };

        checkPlayerReady();
    }
    initGloboPlayers();

    /* --- Video Carousel Logic --- */
    const videoSlides = document.querySelectorAll('.video-slide');
    const videoDots = document.querySelectorAll('.video-dot');
    const prevVideoBtn = document.querySelector('.prev-video-btn');
    const nextVideoBtn = document.querySelector('.next-video-btn');
    let currentVideoIndex = 0;

    function updateVideoCarousel(index) {
        // Stop current video from playing using postMessage API instead of reloading
        videoSlides.forEach((slide, i) => {
            if (i !== index) {
                // Suspende vídeo que não está ativo
                const globoPlayer = slide.querySelector('.globo-player');
                if (globoPlayer && globoPlayer.wmPlayerInstance) {
                    try { globoPlayer.wmPlayerInstance.pause(); } catch (e) { }
                }
                const iframe = slide.querySelector('iframe');
                if (iframe && iframe.contentWindow) {
                    try { iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*'); } catch (e) { }
                }
                slide.style.display = 'none';
            }
        });

        videoDots.forEach(dot => {
            dot.classList.remove('active');
            dot.style.backgroundColor = 'white';
            dot.style.opacity = '0.5';
        });

        const activeSlide = videoSlides[index];
        activeSlide.style.display = 'flex';

        // Se o player já tinha sido inicializado, forçamos o play novamente.
        // Se ainda não foi inicializado, o IntersectionObserver vai capturar quando ficar display: flex.
        const activeGloboPlayer = activeSlide.querySelector('.globo-player');
        if (activeGloboPlayer && activeGloboPlayer.wmPlayerInstance) {
            try { activeGloboPlayer.wmPlayerInstance.play(); } catch (e) { }
        }

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
