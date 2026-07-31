// app.js - Entry point, library initialization

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis (Smooth Scrolling)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time)=>{
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);

    // 2. Initialize Swiper for Reviews
    const reviewSwiper = new Swiper('.review-swiper', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        loop: true,
        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
        },
    });

    // 3. Header Scroll Effect
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. Smooth Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                e.preventDefault();
                lenis.scrollTo(targetElement);
            }
        });
    });

    // 5. Mobile Menu Drawer Logic
    const menuBtn = document.getElementById('open-menu');
    const menuDrawer = document.getElementById('menu-drawer');
    const closeMenuBtn = document.getElementById('close-menu');
    const cartOverlay = document.getElementById('cart-overlay'); // We reuse the overlay

    function toggleMenu() {
        if(menuDrawer) {
            menuDrawer.classList.toggle('open');
            cartOverlay.classList.toggle('open');
        }
    }

    if(menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if(closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);
    
    // Close menu when clicking overlay
    if(cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            if(menuDrawer && menuDrawer.classList.contains('open')) {
                toggleMenu();
            }
        });
    }
});
