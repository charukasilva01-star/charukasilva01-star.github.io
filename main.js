// ============================================================
//  WEBGL FLUID + GSAP ANIMATIONS
// ============================================================

gsap.registerPlugin(ScrollTrigger);

// ============================================================
//  1. WEBGL FLUID SIMULATION
// ============================================================
const canvas = document.getElementById('fluid-canvas');
if (window.WebGLFluid && canvas) {
    WebGLFluid(canvas, {
        IMMEDIATE: true,
        TRIGGER: 'hover',
        SIM_RESOLUTION: 64, // Reduced for performance
        DYE_RESOLUTION: 512, // Reduced for performance
        CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 1,
        VELOCITY_DISSIPATION: 0.2,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 10, // Reduced for performance
        CURL: 30,
        SPLAT_RADIUS: 0.25,
        SPLAT_FORCE: 6000,
        SHADING: true,
        COLORFUL: true,
        COLOR_UPDATE_SPEED: 10,
        PAUSED: false,
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        TRANSPARENT: false,
        BLOOM: false, // Disabled for performance
        SUNRAYS: false // Disabled for performance
    });
}

// ============================================================
//  2. PRELOADER & INIT
// ============================================================
const preloaderFill = document.getElementById('preloader-fill');
const preloader = document.getElementById('preloader');

gsap.to(preloaderFill, {
    width: "100%",
    duration: 1.5,
    ease: "power2.inOut",
    onComplete: () => {
        preloader.classList.add('done');
        document.getElementById('nav').classList.add('visible');
        initAnimations();
    }
});

// ============================================================
//  3. CUSTOM CURSOR
// ============================================================
if (window.matchMedia("(hover: hover)").matches) {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    function animateCursor() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .reel-full, .slideshow, .magnetic').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
}

// ============================================================
//  4. SPLIT TEXT UTILITY
// ============================================================
function splitTextElements() {
    document.querySelectorAll('.split-text').forEach(el => {
        if (el.querySelector('.char')) return;
        const text = el.getAttribute('data-text') || el.textContent;
        el.innerHTML = '';
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            el.appendChild(span);
        });
    });
}

// ============================================================
//  5. MAIN ANIMATIONS (Called after preloader)
// ============================================================
function initAnimations() {
    splitTextElements();

    // Hero Text Entrance
    document.querySelectorAll('.hero-line').forEach((line, index) => {
        gsap.fromTo(line.querySelectorAll('.char'),
            { y: 100, opacity: 0, rotateX: -60 },
            { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.03, ease: "power3.out", delay: 0.2 + (index * 0.1) }
        );
    });

    // Avatar Entrance
    gsap.fromTo("#hero-avatar",
        { scale: 0.7, opacity: 0, y: 60 },
        { scale: 1, opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.5 }
    );

    // Hero Bottom Entrance
    gsap.fromTo("#hero-bottom",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.8 }
    );

    // Hero Parallax on Scroll
    const heroTL = gsap.timeline({
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 }
    });
    heroTL.to(".hero-text", { y: -200, opacity: 0 }, 0);
    heroTL.to("#hero-avatar", { scale: 0.5, y: 250, opacity: 0 }, 0);
    heroTL.to("#hero-bottom", { y: -60, opacity: 0 }, 0);
    heroTL.to("#scroll-ind", { opacity: 0 }, 0);

    // Nav Background Transition
    ScrollTrigger.create({
        start: 100,
        onUpdate: (self) => {
            const nav = document.getElementById("nav");
            self.scroll() > 100 ? nav.classList.add("scrolled") : nav.classList.remove("scrolled");
        }
    });

    // Section Headers
    document.querySelectorAll('.section-head .split-text, .contact .split-text').forEach(el => {
        const chars = el.querySelectorAll('.char');
        if (chars.length === 0) return;
        gsap.fromTo(chars,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.02, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" } }
        );
    });

    // Initialize VanillaTilt for elements with data-tilt
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
    }
}

// ============================================================
//  6. SLIDESHOW LOGIC
// ============================================================
const slides = document.querySelectorAll('.slide');
const progressBar = document.getElementById('slideshow-progress');
const prevBtn = document.getElementById('slide-prev');
const nextBtn = document.getElementById('slide-next');
const dotsContainer = document.getElementById('slideshow-dots');

let currentSlide = 0;
const totalSlides = slides.length;
const SLIDE_DURATION = 3500;
let progressAnim = null;

if (totalSlides > 0) {
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    function goToSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dotsContainer.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
        currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
        slides[currentSlide].classList.add('active');
        dotsContainer.querySelectorAll('.dot')[currentSlide].classList.add('active');
        startProgress();
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function startProgress() {
        if (progressAnim) progressAnim.kill();
        gsap.set(progressBar, { width: "0%" });
        progressAnim = gsap.to(progressBar, { width: "100%", duration: SLIDE_DURATION / 1000, ease: "none", onComplete: nextSlide });
    }

    startProgress();

    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevSlide(); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextSlide(); });

    let touchStartX = 0;
    const slideshowEl = document.getElementById('slideshow');
    slideshowEl.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    slideshowEl.addEventListener('touchend', (e) => {
        const diff = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diff) > 50) { diff < 0 ? nextSlide() : prevSlide(); }
    });
}

// ============================================================
//  7. REELS (Tap to Play)
// ============================================================
document.querySelectorAll('.reel-full').forEach(reel => {
    const video = reel.querySelector('.reel-vid');
    reel.addEventListener('click', () => {
        if (video.paused) { video.play().then(() => reel.classList.add('playing')).catch(() => {}); }
        else { video.pause(); reel.classList.remove('playing'); }
    });
    ScrollTrigger.create({
        trigger: reel, start: "top 70%", end: "bottom 30%",
        onEnter: () => video.play().then(() => reel.classList.add('playing')).catch(() => {}),
        onLeave: () => { video.pause(); reel.classList.remove('playing'); },
        onEnterBack: () => video.play().then(() => reel.classList.add('playing')).catch(() => {}),
        onLeaveBack: () => { video.pause(); reel.classList.remove('playing'); },
    });
});

// ============================================================
//  8. MAGNETIC BUTTONS
// ============================================================
if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
            btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        });
        btn.addEventListener('mouseenter', () => { btn.style.transition = 'none'; });
    });
}
