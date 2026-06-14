document.addEventListener('DOMContentLoaded', () => {
    const avatarImg = document.getElementById('hero-avatar-img');
    const heroSection = document.querySelector('.hero');

    if (avatarImg && heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            // Get mouse position relative to the hero section
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.

            // Calculate rotation values (max 15 degrees)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -15; 
            const rotateY = ((x - centerX) / centerX) * 15;

            // Apply the transformation
            avatarImg.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        // Reset transform when mouse leaves the hero section
        heroSection.addEventListener('mouseleave', () => {
            avatarImg.style.transform = `rotateX(0deg) rotateY(0deg)`;
        });
    }
});
