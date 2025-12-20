// Premium Interactivity for Personal Site

document.addEventListener('DOMContentLoaded', () => {
    const blob = document.querySelector('.cursor-blob');
    const header = document.getElementById('main-header');

    // Subtle background blob movement
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        
        // Smooth transition for the blob
        blob.animate({
            left: `${clientX}px`,
            top: `${clientY}px`
        }, { duration: 3000, fill: 'forwards' });
    });

    // Header scroll state
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.8rem 0';
            header.style.background = 'rgba(10, 10, 12, 0.8)';
        } else {
            header.style.padding = '1.5rem 0';
            header.style.background = 'transparent';
        }
    });

    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply to sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease-out';
        observer.observe(section);
    });

    // Simple reveal style update
    document.addEventListener('scroll', () => {
        document.querySelectorAll('section').forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    });
});
