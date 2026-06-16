// ============================================================
//  PREMIUM ANIMATIONS & INTERACTIONS
// ============================================================

gsap.registerPlugin(ScrollTrigger);

// ---- HERO PARALLAX ----
const heroTL = gsap.timeline({
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
    }
});
heroTL.to("#h1", { y: -180, opacity: 0 }, 0);
heroTL.to("#h2", { y: 180, opacity: 0 }, 0);
heroTL.to("#hero-avatar", { scale: 0.5, y: 200, opacity: 0 }, 0);
heroTL.to("#hero-bottom", { y: -40, opacity: 0 }, 0);
heroTL.to("#scroll-ind", { opacity: 0 }, 0);

// ---- NAV SCROLL STATE ----
const nav = document.getElementById("nav");
ScrollTrigger.create({
    start: 80,
    onUpdate: (self) => {
        if (self.scroll() > 80) {
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }
    }
});

// ---- FADE-INS ----
document.querySelectorAll('.fade-in').forEach(el => {
    gsap.fromTo(el,
        { y: 50, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" }
        }
    );
});

// ============================================================
//  SLIDESHOW — Auto-playing image carousel
// ============================================================
const slides = document.querySelectorAll('.slide');
const progressBar = document.getElementById('slideshow-progress');
const prevBtn = document.getElementById('slide-prev');
const nextBtn = document.getElementById('slide-next');
const currentDisplay = document.getElementById('slide-current');
const totalDisplay = document.getElementById('slide-total');

let currentSlide = 0;
const totalSlides = slides.length;
const SLIDE_DURATION = 3500; // ms per slide
let slideTimer = null;
let progressAnim = null;

totalDisplay.textContent = totalSlides;

function goToSlide(index) {
    // Remove active from all
    slides.forEach(s => s.classList.remove('active'));
    
    // Wrap around
    currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
    
    // Activate
    slides[currentSlide].classList.add('active');
    currentDisplay.textContent = currentSlide + 1;
    
    // Reset progress
    startProgress();
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function startProgress() {
    // Kill existing
    if (progressAnim) progressAnim.kill();
    
    gsap.set(progressBar, { width: "0%" });
    progressAnim = gsap.to(progressBar, {
        width: "100%",
        duration: SLIDE_DURATION / 1000,
        ease: "none",
        onComplete: nextSlide
    });
}

// Start autoplay
startProgress();

// Button handlers
prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevSlide(); });
nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextSlide(); });

// Touch swipe support for slideshow
let touchStartX = 0;
const slideshowEl = document.getElementById('slideshow');
slideshowEl.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
slideshowEl.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) {
        if (diff < 0) nextSlide();
        else prevSlide();
    }
});

// ============================================================
//  REELS — Tap to play/pause + Scroll autoplay
// ============================================================
const reels = document.querySelectorAll('.reel-full');

reels.forEach(reel => {
    const video = reel.querySelector('.reel-vid');
    
    // Tap to play/pause
    reel.addEventListener('click', () => {
        if (video.paused) {
            video.play().then(() => {
                reel.classList.add('playing');
            }).catch(() => {});
        } else {
            video.pause();
            reel.classList.remove('playing');
        }
    });
    
    // Scroll-triggered autoplay
    ScrollTrigger.create({
        trigger: reel,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => {
            video.play().then(() => {
                reel.classList.add('playing');
            }).catch(() => {});
        },
        onLeave: () => {
            video.pause();
            reel.classList.remove('playing');
        },
        onEnterBack: () => {
            video.play().then(() => {
                reel.classList.add('playing');
            }).catch(() => {});
        },
        onLeaveBack: () => {
            video.pause();
            reel.classList.remove('playing');
        },
    });
});
