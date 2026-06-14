/* ==========================================================================
   CHARUKA SILVA PORTFOLIO - REDESIGNED MARKETING INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Mobile Navigation Burger Toggle --- */
    const navBurger = document.querySelector('.nav-burger');
    const navLinks = document.querySelector('.nav-links');
    const navCta = document.querySelector('.nav-cta');

    if (navBurger) {
        navBurger.addEventListener('click', () => {
            navBurger.classList.toggle('active');
            
            // Toggle menu visibility
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
                navCta.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(6, 7, 11, 0.98)';
                navLinks.style.padding = '24px';
                navLinks.style.borderBottom = '1px solid var(--border-color)';
                navLinks.style.gap = '20px';
                
                navCta.style.display = 'block';
                navCta.style.position = 'absolute';
                navCta.style.top = '280px';
                navCta.style.left = '24px';
                navCta.style.width = 'calc(100% - 48px)';
            }
        });
    }

    // Close mobile menu when links are clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && navLinks) {
                navLinks.style.display = 'none';
                if (navCta) navCta.style.display = 'none';
                if (navBurger) navBurger.classList.remove('active');
            }
        });
    });

    /* --- Scroll Reveal Animations --- */
    const revealElements = () => {
        const reveals = document.querySelectorAll('.detail-card, .seo-table-wrapper, .pooja-video-card, .gal-img, .garage-content-grid, .rainflow-content-grid, .contact-wrapper');
        const windowHeight = window.innerHeight;
        
        reveals.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 80;
            
            if (elementTop < windowHeight - elementVisible) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };

    // Apply initial fade transitions
    const elementsToReveal = document.querySelectorAll('.detail-card, .seo-table-wrapper, .pooja-video-card, .gal-img, .garage-content-grid, .rainflow-content-grid, .contact-wrapper');
    elementsToReveal.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    window.addEventListener('scroll', revealElements);
    revealElements(); // Initial run

    /* --- Contact Form Consulting Simulation --- */
    const contactForm = document.getElementById('portfolio-contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                formStatus.textContent = 'Thank you! Your B2B consulting inquiry has been submitted successfully.';
                formStatus.className = 'form-status success';
                
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
                
            }, 1200);
        });
    }
});
