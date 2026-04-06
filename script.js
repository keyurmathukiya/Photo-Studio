document.addEventListener("DOMContentLoaded", () => {
    
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis Smooth Scroll
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

    // Integrate GSAP with Lenis (single RAF loop via GSAP ticker)
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(false);
    // Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorBlob = document.querySelector('.cursor-blob');
    
    // Use matchMedia to disable custom cursor on touch devices
    if(window.matchMedia("(pointer: fine)").matches) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        
        let cursorX = mouseX;
        let cursorY = mouseY;
        
        // Easing factor
        let blobSpeed = 0.15;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            // Move dot instantly
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
            cursorDot.style.opacity = '1';
        });
        
        // Hover effect on cursor blob — use GSAP for butter-smooth blob tracking
        gsap.ticker.add(() => {
            cursorX += (mouseX - cursorX) * 0.12;
            cursorY += (mouseY - cursorY) * 0.12;
            gsap.set(cursorBlob, { x: cursorX, y: cursorY, opacity: 1 });
        });
        
        // Hover interactions
        const interactables = document.querySelectorAll('a, button, .slide-controls > div, .menu-toggle');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        // Advanced Magnetic Button Logic
        const magneticBtns = document.querySelectorAll('.magnetic-btn');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(btn, {
                    x: x * 0.4,
                    y: y * 0.4,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.7,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    } else {
        cursorDot.style.display = 'none';
        cursorBlob.style.display = 'none';
    }


    // Preloader Animation
    const preloaderTimeline = gsap.timeline();

    preloaderTimeline
        .to(".loading-progress", {
            width: "100%",
            duration: 1.5,
            ease: "power2.inOut"
        })
        .to(".preloader-text span", {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)",
            delay: -1
        })
        .to(".preloader", {
            yPercent: -100,
            duration: 1.2,
            ease: "power4.inOut",
            delay: 0.5
        })
        .from(".navbar", {
            y: -50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.5")
        .from(".slide-title", {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out"
        }, "-=0.8");


    // Grand Slider - Swiper js integration
    const mySwiper = new Swiper(".mySwiper", {
        loop: true,
        speed: 1500, /* Slow cinematic transition speed */
        parallax: true,
        effect: "fade", // Can use creative effect for more grand feel
        fadeEffect: {
            crossFade: true
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
        },
        on: {
            slideChangeTransitionStart: function () {
                // Animate text out
                gsap.to(this.slides[this.previousIndex]?.querySelectorAll('.slide-title, .slide-subtitle'), {
                    y: -50,
                    opacity: 0,
                    duration: 0.5
                });
            },
            slideChangeTransitionEnd: function () {
                // Animate image zoom effect and text in
                const activeSlide = this.slides[this.activeIndex];
                const img = activeSlide.querySelector('img');
                const title = activeSlide.querySelector('.slide-title');
                const subtitle = activeSlide.querySelector('.slide-subtitle');
                
                // Slow continuous zoom on the image
                gsap.fromTo(img, 
                    { scale: 1.15 }, 
                    { scale: 1, duration: 6, ease: "sine.out" }
                );
                
                // Text entrance
                gsap.fromTo([title, subtitle],
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
                );
            }
        }
    });

    // Intro Section Text Reveal using SplitType
    const textReveal = new SplitType('.reveal-text', { types: 'lines, words' });
    
    gsap.from(textReveal.words, {
        scrollTrigger: {
            trigger: ".ethereal-about",
            start: "top 80%",
            end: "bottom 50%",
            scrub: 1,
        },
        opacity: 0.1,
        y: 20,
        stagger: 0.05,
        duration: 2,
        ease: "power2.out"
    });

    // Horizontal Scroll Section Animation
    // Only apply on desktop
    if(window.innerWidth > 1024) {
        const horizontalSections = gsap.utils.toArray('.horizontal-slide');
        
        gsap.to(horizontalSections, {
            xPercent: -100 * (horizontalSections.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: ".horizontal-scroll",
                pin: true,
                scrub: 1,
                snap: 1 / (horizontalSections.length - 1),
                end: () => "+=" + document.querySelector(".horizontal-wrapper").offsetWidth
            }
        });
    }

    // Generalized Split Title Reveal Sub-section Advanced Animation
    const titleSkews = gsap.utils.toArray('.title-skew');
    titleSkews.forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title.parentElement,
                start: "top 90%",
                end: "bottom 60%",
                scrub: 1
            },
            y: 100,
            opacity: 0,
            skewY: 5,
            duration: 1.5,
            ease: "power4.out"
        });
    });

    const masonryItems = gsap.utils.toArray('.masonry-item img');
    masonryItems.forEach((img, index) => {
        // Individual parallax speeds
        gsap.to(img, {
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            y: (index % 2 === 0 ? '-15%' : '15%'),
            ease: "none"
        });
        
        // Advanced Grid Appear Effect
        gsap.fromTo(img.parentElement, 
            {
                clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)',
                y: 100,
                scale: 0.9
            },
            {
                scrollTrigger: {
                    trigger: img.parentElement,
                    start: "top 90%"
                },
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                y: 0,
                scale: 1,
                duration: 1.8,
                ease: "power4.out"
            }
        );
    });

    // Footer Parallax
    gsap.from(".footer-container", {
        y: -100,
        opacity: 0,
        scrollTrigger: {
            trigger: ".footer",
            start: "top bottom",
            end: "bottom bottom",
            scrub: true
        }
    });
    // Infinite Marquee Animation
    gsap.to(".marquee-inner", {
        xPercent: -50,
        ease: "none",
        duration: 30,
        repeat: -1
    });

    // Dark/Light background morphing
    ScrollTrigger.create({
        trigger: ".horizontal-scroll",
        start: "top center",
        end: "bottom top",
        onEnter: () => document.body.classList.add("dark-mode"),
        onLeaveBack: () => document.body.classList.remove("dark-mode"),
        onLeave: () => document.body.classList.remove("dark-mode"),
        onEnterBack: () => document.body.classList.add("dark-mode")
    });



    // Premium Smooth Anchor Routing for all Top Nav / Menu links
    document.querySelectorAll('.nav-link, .menu-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('href');
            if(!target || !target.startsWith('#')) return; // ignore standard links
            e.preventDefault();
            
            if(target === '#') {
                lenis.scrollTo(0, { duration: 1.5, ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                // Cleanly remove # from URL
                window.history.pushState("", document.title, window.location.pathname);
            } else {
                lenis.scrollTo(target, { offset: -50, duration: 1.5, ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                window.history.pushState("", document.title, target);
            }
        });
    });

    // Adovasio Inspired Features - HUD & Kinetic Typography
    const floatingHud = document.querySelector('.floating-hud');
    
    if (floatingHud) {
        // Show after scrolling past hero
        ScrollTrigger.create({
            start: "top -500px",
            end: "max",
            onUpdate: (self) => {
                if(self.progress > 0.05) {
                    floatingHud.classList.add('visible');
                } else {
                    floatingHud.classList.remove('visible');
                }
            }
        });
        
        // Scroll to Masonry on click
        floatingHud.addEventListener('click', () => {
            lenis.scrollTo('#journal', { duration: 2, ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        });
    }

    const kineticSection = document.querySelector('.kinetic-typography');
    if (kineticSection) {
        gsap.to('.k-left', {
            xPercent: -40,
            yPercent: -20,
            rotation: -5,
            ease: "none",
            scrollTrigger: {
                trigger: kineticSection,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
        
        gsap.to('.k-right', {
            xPercent: 40,
            yPercent: 20,
            rotation: 5,
            ease: "none",
            scrollTrigger: {
                trigger: kineticSection,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
        
        gsap.to('.k-center', {
            scale: 1.3,
            ease: "none",
            scrollTrigger: {
                trigger: kineticSection,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
    }

});
