// cursor.js - Magnetic Custom Cursor

const cursorDot = document.querySelector('.cursor-dot');
const cursorGlow = document.querySelector('.cursor-glow');

let mouseX = 0;
let mouseY = 0;
let glowX = 0;
let glowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot follows instantly
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
});

// Glow follows with delay
function animateGlow() {
    let distX = mouseX - glowX;
    let distY = mouseY - glowY;
    
    glowX += distX * 0.15;
    glowY += distY * 0.15;
    
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    
    requestAnimationFrame(animateGlow);
}
animateGlow();

// Magnetic effect on buttons
const magneticElements = document.querySelectorAll('.magnetic-btn, .icon-btn');

magneticElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorGlow.classList.add('magnetic');
    });
    
    el.addEventListener('mouseleave', () => {
        cursorGlow.classList.remove('magnetic');
        gsap.to(el, {x: 0, y: 0, duration: 0.5, ease: 'power3.out'});
    });
    
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * 0.3;
        const deltaY = (e.clientY - centerY) * 0.3;
        
        gsap.to(el, {
            x: deltaX,
            y: deltaY,
            duration: 0.2,
            ease: 'power2.out'
        });
    });
});
