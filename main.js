
document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Disable custom cursor on touch devices
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isTouchDevice) {
        if(cursorDot) cursorDot.style.display = 'none';
        if(cursorOutline) cursorOutline.style.display = 'none';
        document.body.style.cursor = 'auto';
    } else {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            // Dot follows exactly
            if(cursorDot) {
                cursorDot.style.transform = `translate(${posX}px, ${posY}px)`;
            }
            
            // Outline follows with slight delay
            if(cursorOutline) {
                cursorOutline.animate({
                    transform: `translate(${posX}px, ${posY}px)`
                }, { duration: 500, fill: "forwards" });
            }
        });
        
        // Hover effects on interactive elements
        const interactives = document.querySelectorAll('a, button, .grid-item, .marquee-item, .glass-pill');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if(cursorOutline) cursorOutline.classList.add('cursor-hover');
                if(cursorDot) cursorDot.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                if(cursorOutline) cursorOutline.classList.remove('cursor-hover');
                if(cursorDot) cursorDot.classList.remove('cursor-hover');
            });
        });
    }

    // 2. Mouse-Reactive Spotlight
    const heroMesh = document.querySelector('.hero-gradient-mesh');
    if (heroMesh && !isTouchDevice) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            heroMesh.style.background = `
                radial-gradient(circle at ${x}% ${y}%, rgba(80, 80, 255, 0.15) 0%, transparent 50%),
                radial-gradient(circle at ${100-x}% ${100-y}%, rgba(40, 10, 120, 0.1) 0%, transparent 40%),
                radial-gradient(circle at 50% 50%, rgba(10, 60, 100, 0.05) 0%, transparent 60%)
            `;
        });
    }

    // 3. Parallax Typography
    const textLines = document.querySelectorAll('.massive-text-stacked');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if(textLines.length >= 2) {
            // First line moves right
            textLines[0].style.transform = `translateX(${scrolled * 0.2}px)`;
            // Second line moves left
            textLines[1].style.transform = `translateX(-${scrolled * 0.2}px)`;
        }
    });

    // 4. Scroll Reveals
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));
});
