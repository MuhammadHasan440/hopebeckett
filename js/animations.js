// animations.js - GSAP & Loader Logic

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Loader Animation
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    
    tl.to(".loader-progress", {
        opacity: 0,
        duration: 0.5,
        delay: 2 
    })
    .to(".loader-title", {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: "power3.in"
    }, "-=0.2")
    .to(".loader", {
        yPercent: -100,
        duration: 1,
        ease: "power4.inOut"
    })
    .call(initAnimations); // Trigger page animations after loader
});

function initAnimations() {
    // Hero Text Reveal
    gsap.to(".hero-title", {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power4.out"
    });
    
    gsap.to(".hero-subtitle", {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power4.out",
        delay: 0.2
    });
    
    gsap.to(".hero-buttons", {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power4.out",
        delay: 0.4
    });

    // Parallax Backgrounds
    gsap.to(".parallax-bg", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // General Fade Up Elements
    const fadeElements = gsap.utils.toArray('.fade-up');
    fadeElements.forEach(elem => {
        gsap.to(elem, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Image Reveal (Clip Path)
    const imageReveals = gsap.utils.toArray('.image-reveal');
    imageReveals.forEach(img => {
        gsap.to(img, {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            opacity: 1,
            duration: 1.5,
            ease: "power4.inOut",
            scrollTrigger: {
                trigger: img,
                start: "top 80%",
            }
        });
    });

    // Parallax Elements (Author image)
    gsap.to(".parallax-element", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
            trigger: ".parallax-container",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
    
    // Reading Progress Bar
    gsap.to(".progress-fill", {
        width: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: ".reading-content",
            start: "top 50%",
            end: "bottom 50%",
            scrub: true
        }
    });
}
