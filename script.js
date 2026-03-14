const GLOBO_PLAYER_API_URL = "https://s3.glbimg.com/v1/AUTH_e1b09a2d222b4900a437a46914be81e5/api/stable/web/api.min.js";

let globoPlayerApiPromise;

function loadGloboPlayerApi() {
    if (typeof window.WM !== "undefined" && window.WM.Player) {
        return Promise.resolve(window.WM);
    }

    if (globoPlayerApiPromise) {
        return globoPlayerApiPromise;
    }

    globoPlayerApiPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = GLOBO_PLAYER_API_URL;
        script.async = true;
        script.dataset.globoPlayerApi = "true";
        script.onload = () => resolve(window.WM);
        script.onerror = () => reject(new Error("Falha ao carregar a API do player."));
        document.head.appendChild(script);
    });

    return globoPlayerApiPromise;
}

function initHeroVideo() {
    const heroVideo = document.getElementById("hero-video");
    if (!heroVideo) return;

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const shouldSkipVideo = window.matchMedia("(prefers-reduced-motion: reduce)").matches || Boolean(connection && connection.saveData);

    if (shouldSkipVideo) {
        heroVideo.remove();
        return;
    }

    const loadAndPlayVideo = () => {
        if (heroVideo.dataset.loaded === "true") return;

        const source = heroVideo.querySelector("source");
        if (!source) return;

        if (source.dataset.src) {
            source.src = source.getAttribute("data-src");
            source.removeAttribute("data-src");
        }

        heroVideo.dataset.loaded = "true";
        heroVideo.load();
        heroVideo.play().catch(() => { });
    };

    heroVideo.addEventListener("playing", () => {
        heroVideo.classList.add("is-ready");
        const heroSection = document.getElementById("hero-section");
        if (heroSection) {
            heroSection.style.backgroundImage = "none";
            heroSection.style.backgroundColor = "#000";
        }
    }, { once: true });

    let isFadingOut = false;

    heroVideo.addEventListener("timeupdate", () => {
        const duration = heroVideo.duration;
        if (!duration || heroVideo.currentTime < 4 || isFadingOut) return;

        isFadingOut = true;
        const fadeDuration = duration - heroVideo.currentTime;
        heroVideo.style.transition = `opacity ${fadeDuration}s linear`;
        heroVideo.style.opacity = "0";
    });

    heroVideo.addEventListener("ended", () => {
        window.setTimeout(() => {
            heroVideo.style.transition = "opacity 1.5s ease";
            heroVideo.currentTime = 0;
            heroVideo.play().catch(() => { });

            window.setTimeout(() => {
                heroVideo.style.opacity = "1";
                isFadingOut = false;
            }, 50);
        }, 2000);
    });

    loadAndPlayVideo();
}

function initRevealAnimations() {
    const revealElements = document.querySelectorAll(".reveal");
    if (revealElements.length === 0) return;

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach((element) => revealOnScroll.observe(element));
}

function initFlipCards() {
    document.addEventListener("click", (event) => {
        const card = event.target.closest(".flip-card");
        if (!card) return;
        card.classList.toggle("flipped");
    });
}

function initCuriositiesCarousel() {
    const curiositiesGrid = document.querySelector(".curiosities-grid");
    if (!curiositiesGrid) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    curiositiesGrid.addEventListener("mousedown", (event) => {
        isDown = true;
        curiositiesGrid.style.cursor = "grabbing";
        curiositiesGrid.style.scrollSnapType = "none";
        startX = event.pageX - curiositiesGrid.offsetLeft;
        scrollLeft = curiositiesGrid.scrollLeft;
    });

    ["mouseleave", "mouseup"].forEach((eventName) => {
        curiositiesGrid.addEventListener(eventName, () => {
            isDown = false;
            curiositiesGrid.style.cursor = "grab";
            curiositiesGrid.style.scrollSnapType = "x mandatory";
        });
    });

    curiositiesGrid.addEventListener("mousemove", (event) => {
        if (!isDown) return;
        event.preventDefault();
        const x = event.pageX - curiositiesGrid.offsetLeft;
        const walk = (x - startX) * 2;
        curiositiesGrid.scrollLeft = scrollLeft - walk;
    });

    curiositiesGrid.style.cursor = "grab";

    const prevBtn = document.querySelector(".prev-curiosity-btn");
    const nextBtn = document.querySelector(".next-curiosity-btn");
    if (!prevBtn || !nextBtn) return;

    const getScrollAmount = () => window.innerWidth <= 768 ? 324 : 324 * 3;

    prevBtn.addEventListener("click", () => {
        curiositiesGrid.scrollBy({
            left: -getScrollAmount(),
            behavior: "smooth"
        });
    });

    nextBtn.addEventListener("click", () => {
        curiositiesGrid.scrollBy({
            left: getScrollAmount(),
            behavior: "smooth"
        });
    });
}

function initQuoteCarousel() {
    const track = document.getElementById("quotesTrack");
    const dots = Array.from(document.querySelectorAll("#quotesDots .dot"));
    const controls = Array.from(document.querySelectorAll("[data-quote-direction]"));
    if (!track || dots.length === 0) return;

    let currentQuoteIndex = 0;
    const totalQuotes = dots.length;

    const updateQuoteCarousel = () => {
        track.style.transform = `translateX(-${currentQuoteIndex * 100}%)`;

        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentQuoteIndex);
        });
    };

    controls.forEach((button) => {
        button.addEventListener("click", () => {
            currentQuoteIndex += Number(button.dataset.quoteDirection || 0);

            if (currentQuoteIndex < 0) currentQuoteIndex = totalQuotes - 1;
            if (currentQuoteIndex >= totalQuotes) currentQuoteIndex = 0;

            updateQuoteCarousel();
        });
    });

    dots.forEach((dot) => {
        dot.addEventListener("click", () => {
            currentQuoteIndex = Number(dot.dataset.quoteIndex || 0);
            updateQuoteCarousel();
        });
    });

    updateQuoteCarousel();
}

function renderCharacters() {
    if (typeof charactersData === "undefined") return;

    const renderGroup = (nucleoId, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const html = charactersData
            .filter((character) => character.nucleoId === nucleoId)
            .map((character) => {
                const imgHtml = character.imgSrc
                    ? `<img class="card-img-placeholder card-img-media" src="${character.imgSrc}" loading="lazy" alt="Personagem">`
                    : `<div class="card-img-placeholder card-img-fallback"></div>`;

                return `
                    <li class="flip-card">
                        <div class="flip-card-inner">
                            <div class="flip-card-front ${character.frontBgClass}">
                                <div class="card-frame card-frame-front"></div>
                                ${imgHtml}
                                <span class="tap-hint" aria-hidden="true">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                                        <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                                    </svg>
                                </span>
                                <div class="card-name-overlay">
                                    <strong class="char-name">${character.frontCharName}</strong>
                                    <span class="actor-name">${character.frontActorName}</span>
                                </div>
                            </div>
                            <div class="flip-card-back bg-dark">
                                <div class="card-frame card-frame-back"></div>
                                <strong class="char-name-back">${character.backCharName}</strong>
                                <span class="actor-name-back">${character.backActorName}</span>
                                <p class="desc">${character.description}</p>
                            </div>
                        </div>
                    </li>
                `;
            })
            .join("");

        container.innerHTML = html;
    };

    renderGroup("batanga", "grid-batanga");
    renderGroup("barropreto", "grid-barro-preto");
}

function initGloboPlayers() {
    const players = document.querySelectorAll(".globo-player");
    if (players.length === 0) return;

    const initializePlayer = (container) => {
        if (container.hasAttribute("data-player-initialized")) return;

        const videoId = container.getAttribute("data-video-id");
        if (!videoId || !window.WM || !window.WM.Player) return;

        container.setAttribute("data-player-initialized", "true");
        container.innerHTML = "";

        const playerInstance = new window.WM.Player({
            videosIDs: videoId,
            width: "100%",
            height: "100%",
            autoPlay: true,
            muted: true,
            skipDFP: true,
            loop: true
        });

        playerInstance.attachTo(container);
        container.wmPlayerInstance = playerInstance;

        const overlay = document.createElement("div");
        overlay.className = "player-overlay";
        overlay.addEventListener("click", () => {
            try { playerInstance.unmute(); } catch (error) { }
            try { playerInstance.setVolume(1); } catch (error) { }
            try { playerInstance.muted = false; } catch (error) { }
            overlay.remove();
        });

        container.appendChild(overlay);
    };

    const playerObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(async (entry) => {
            if (!entry.isIntersecting) return;

            observer.unobserve(entry.target);

            try {
                const wm = await loadGloboPlayerApi();
                if (wm && wm.playerAvailable) {
                    await wm.playerAvailable;
                }
                initializePlayer(entry.target);
            } catch (error) {
                entry.target.innerHTML = '<div class="player-loading">Nao foi possivel carregar o player.</div>';
            }
        });
    }, {
        threshold: 0.25,
        rootMargin: "300px 0px"
    });

    players.forEach((player) => playerObserver.observe(player));
}

function initVideoCarousel() {
    const videoSlides = Array.from(document.querySelectorAll(".video-slide"));
    const videoDots = Array.from(document.querySelectorAll(".video-dot"));
    const prevVideoBtn = document.querySelector(".prev-video-btn");
    const nextVideoBtn = document.querySelector(".next-video-btn");
    if (!prevVideoBtn || !nextVideoBtn || videoSlides.length === 0) return;

    let currentVideoIndex = 0;

    const updateVideoCarousel = (index) => {
        const activeSlide = videoSlides[index];
        if (!activeSlide) return;

        videoSlides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === index;

            if (!isActive) {
                const globoPlayer = slide.querySelector(".globo-player");
                if (globoPlayer && globoPlayer.wmPlayerInstance) {
                    try { globoPlayer.wmPlayerInstance.pause(); } catch (error) { }
                }

                const iframe = slide.querySelector("iframe");
                if (iframe && iframe.contentWindow) {
                    try {
                        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*");
                    } catch (error) { }
                }
            }

            slide.classList.toggle("video-slide-hidden", !isActive);
        });

        videoDots.forEach((dot, dotIndex) => {
            dot.classList.toggle("active", dotIndex === index);
        });

        const activeGloboPlayer = activeSlide.querySelector(".globo-player");
        if (activeGloboPlayer && activeGloboPlayer.wmPlayerInstance) {
            try { activeGloboPlayer.wmPlayerInstance.play(); } catch (error) { }
        }
    };

    prevVideoBtn.addEventListener("click", () => {
        currentVideoIndex = (currentVideoIndex - 1 + videoSlides.length) % videoSlides.length;
        updateVideoCarousel(currentVideoIndex);
    });

    nextVideoBtn.addEventListener("click", () => {
        currentVideoIndex = (currentVideoIndex + 1) % videoSlides.length;
        updateVideoCarousel(currentVideoIndex);
    });

    videoDots.forEach((dot) => {
        dot.addEventListener("click", () => {
            currentVideoIndex = Number(dot.dataset.index || 0);
            updateVideoCarousel(currentVideoIndex);
        });
    });

    updateVideoCarousel(currentVideoIndex);
}

document.addEventListener("DOMContentLoaded", () => {
    initHeroVideo();
    initRevealAnimations();
    initFlipCards();
    initCuriositiesCarousel();
    initQuoteCarousel();
    renderCharacters();
    initGloboPlayers();
    initVideoCarousel();
});
