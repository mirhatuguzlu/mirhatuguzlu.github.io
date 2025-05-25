document.addEventListener('DOMContentLoaded', function() {
    // --- Smooth scrolling for ALL anchor links ---
    const allSmoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    const navHeaderLinks = document.querySelectorAll('header nav ul li a[href^="#"]'); // Specific for active highlighting

    allSmoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Update active class only for header navigation links
                if (Array.from(navHeaderLinks).includes(this)) {
                    navHeaderLinks.forEach(l => l.classList.remove('active-link'));
                    this.classList.add('active-link');
                }

                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Active Navigation Link Highlighting on Scroll (targets header links) ---
    const sections = document.querySelectorAll('section[id]');
    function highlightNavOnScroll() {
        let scrollY = window.pageYOffset;
        let currentSectionId = '';

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // Adjusted for header height/offset
            let sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                currentSectionId = sectionId;
            }
        });

        navHeaderLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active-link');
            }
        });

        if (currentSectionId === '' && scrollY < (sections.length > 0 ? sections[0].offsetTop -100 : 50) ) {
            navHeaderLinks.forEach(link => link.classList.remove('active-link'));
             // If hero is the first section and has a nav link
            const heroLink = Array.from(navHeaderLinks).find(l => l.getAttribute('href') === '#hero');
            if (heroLink && sections.length > 0 && sections[0].id === 'hero') {
                 // No active link if scrolled to very top above hero, or hero itself doesn't have a nav link
            } else if (heroLink) {
                 // If we are at the top and there's a hero link, it could be active by default or handled differently
                 // For now, let's ensure no link is active if truly at the very top before any section logic kicks in.
            }
        }
    }
    window.addEventListener('scroll', highlightNavOnScroll);
    highlightNavOnScroll();

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
        typeWriter();
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

    console.log("Portfolio script loaded with advanced features and button effects.");
});
