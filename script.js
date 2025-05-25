document.addEventListener('DOMContentLoaded', function() {
    // --- Smooth scrolling for ALL anchor links ---
    const allSmoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    const navHeaderLinksDesktop = document.querySelectorAll('header nav ul#nav-links li a[href^="#"]'); // Desktop links for active highlighting
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinksMobile = document.querySelector('ul#nav-links'); // The UL for mobile toggling

    // --- Hamburger Menu Toggle ---
    if (hamburgerMenu && navLinksMobile) {
        hamburgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinksMobile.classList.toggle('active');
            // ARIA attribute update
            const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !isExpanded);
            // Optional: Prevent body scrolling when mobile menu is open
            if (navLinksMobile.classList.contains('active')) {
                document.body.classList.add('no-scroll');
            } else {
                document.body.classList.remove('no-scroll');
            }
        });

        // Close mobile menu when a link is clicked
        navLinksMobile.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                if (navLinksMobile.classList.contains('active')) {
                    hamburgerMenu.classList.remove('active');
                    navLinksMobile.classList.remove('active');
                    hamburgerMenu.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('no-scroll'); // Re-enable scrolling
                }
            });
        });
    }

    // --- Smooth scrolling for ALL anchor links (including mobile dropdown links) ---
    allSmoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            // Special case for logo or home link to scroll to top
            if (targetId === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Potentially remove active class from nav links if you have a logo-is-home behavior
                if (navLinksMobile && navLinksMobile.classList.contains('active')) { // If mobile menu is open
                     // No specific active link change here, handled by scroll or direct click logic
                } else {
                    navHeaderLinksDesktop.forEach(l => l.classList.remove('active-link'));
                }
                return; // Stop further processing for this simple top link
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Active class update for DESKTOP header navigation links on direct click
                if (Array.from(navHeaderLinksDesktop).includes(this) && (!navLinksMobile || !navLinksMobile.classList.contains('active'))) {
                    navHeaderLinksDesktop.forEach(l => l.classList.remove('active-link'));
                    this.classList.add('active-link');
                }
                // For mobile, active class is primarily handled by scroll or when menu closes

                const headerHeight = document.querySelector('header') ? document.querySelector('header').offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Active Navigation Link Highlighting on Scroll (targets DESKTOP links) ---
    // For mobile, active link could also be set, but typically less critical when menu is an overlay
    const sections = document.querySelectorAll('section[id]');
    function highlightNavOnScroll() {
        let scrollY = window.pageYOffset;
        const headerHeight = document.querySelector('header') ? document.querySelector('header').offsetHeight : 0;
        let currentSectionId = '';

        sections.forEach(current => {
            const sectionTop = current.offsetTop - headerHeight - 20; // Adjusted offset
            const sectionBottom = sectionTop + current.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                currentSectionId = current.getAttribute('id');
            }
        });

        navHeaderLinksDesktop.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active-link');
            }
        });
         // If at the top, above first section, clear active links (desktop)
        if (sections.length > 0 && scrollY < (sections[0].offsetTop - headerHeight - 20)){
            navHeaderLinksDesktop.forEach(link => link.classList.remove('active-link'));
        }
    }
    window.addEventListener('scroll', highlightNavOnScroll);
    highlightNavOnScroll(); // Initial call

    // --- Typing Effect for Hero Title ---
    const heroTitle = document.querySelector('#hero .hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        function typeWriter() {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        // Only start typing effect if hero section is observed (optional improvement)
        const heroSection = document.getElementById('hero');
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Small delay before starting typing
                    setTimeout(typeWriter, 300);
                    heroObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        if (heroSection) {
            heroObserver.observe(heroSection);
        }
    }

    // --- Scroll Animations for Sections/Elements (Fade-in effect) ---
    const animatedElements = document.querySelectorAll('.section h2, .project-card, .skill-category');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };
    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        scrollObserver.observe(el);
    });

    // --- Button Click Effect ---
    const allButtons = document.querySelectorAll('.btn, .contact-btn, .project-link');
    allButtons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.classList.add('js-button-pressed');
        });
        button.addEventListener('mouseup', function() {
            this.classList.remove('js-button-pressed');
        });
        button.addEventListener('mouseleave', function() { // In case mouseup happens outside
            this.classList.remove('js-button-pressed');
        });
        button.addEventListener('touchstart', function() {
            this.classList.add('js-button-pressed');
        });
        button.addEventListener('touchend', function() {
            this.classList.remove('js-button-pressed');
        });
    });

    console.log("Portfolio script loaded with hamburger menu and light theme adjustments.");
});
