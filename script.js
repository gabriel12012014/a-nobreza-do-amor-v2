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

    /* No longer using Carousel logic */

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
});
