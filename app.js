document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.concept-item, .secondary-nav a');

    // Initialize WebGL Smoke
    if (window.initSmoke) {
        window.initSmoke();
    }
<<<<<<< HEAD
=======

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // STOP immediate navigation
            const targetUrl = this.getAttribute('href');

            const canvas = document.querySelector('.smoke-plume');

            // 1. Trigger Visuals
            if (canvas) canvas.classList.add('gust');
            if (window.smokeInstance) {
                window.smokeInstance.triggerBreeze(-0.5, 0.5);
            }

            // 2. Wait for animation, then Go
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 800); // 800ms delay to watch the smoke fly
        });
    });
>>>>>>> 9d28686 (feat: Implement Leak Terminal with markdown loader and gold noir aesthetic)
});