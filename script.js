document.addEventListener('DOMContentLoaded', function () {
    // --- Hamburger menü ---
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.getElementById('nav-links');
    const closeMenu = () => {
        hamburgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
        hamburgerMenu.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
    };
    hamburgerMenu.addEventListener('click', function () {
        const open = !navLinks.classList.contains('active');
        this.classList.toggle('active', open);
        navLinks.classList.toggle('active', open);
        this.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('no-scroll', open);
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    // Hareket azaltma tercih edilmişse ya da CDN yüklenemediyse site düz, okunur bir sayfa olarak kalır.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !window.gsap || !window.ScrollTrigger) return;

    document.documentElement.classList.add('motion');
    gsap.registerPlugin(ScrollTrigger);

    // --- Lenis: yumuşak kaydırma, GSAP ile aynı saatte çalışır ---
    let lenis = null;
    if (window.Lenis) {
        lenis = new Lenis({ lerp: 0.08 });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(t => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
    }
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            lenis ? lenis.scrollTo(target, { duration: 1.8 }) : target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // --- Metni harf/kelime span'lerine böl (ekran okuyucu için aria-label korunur) ---
    function split(el, byChar) {
        const text = el.textContent.trim().replace(/\s+/g, ' ');
        el.setAttribute('aria-label', text);
        el.innerHTML = text.split(' ').map(w =>
            `<span class="word" aria-hidden="true">${byChar ? [...w].map(c => `<span class="char">${c}</span>`).join('') : w}</span>`
        ).join(' ');
        return el.querySelectorAll(byChar ? '.char' : '.word');
    }

    // ===== Giriş animasyonu (sayfa yüklenince) =====
    const heroChars = [];
    document.querySelectorAll('.hero-line').forEach(l => heroChars.push(...split(l, true)));

    gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('.bar-top, .bar-bottom', { scaleY: 6, duration: 1.4, ease: 'expo.inOut' })
        .from('.hero-iris', { scale: 0, duration: 1.8, ease: 'expo.inOut' }, 0.2)
        .from('.hero-kicker', { opacity: 0, y: 20, duration: 1 }, 0.9)
        .from(heroChars, { yPercent: 110, rotateX: -70, opacity: 0, stagger: 0.035, duration: 1.2 }, 1.0)
        .from('.hero-role', { opacity: 0, y: 16, duration: 1 }, '-=0.6')
        .from('.hud', { opacity: 0, duration: 1 }, '<');

    // ===== 01: fotoğraf çerçevesi açılır, isim kayar, kararır =====
    gsap.timeline({ scrollTrigger: { trigger: '#giris', start: 'top top', end: '+=130%', scrub: 1, pin: true } })
        .to('.hero-iris', { clipPath: 'circle(80% at 50% 45%)', ease: 'none' }, 0)
        .to('.hero-photo', { scale: 1.15, filter: 'grayscale(1) brightness(0.3) contrast(1.1)', ease: 'none' }, 0)
        .to('.hero-copy', { yPercent: -40, scale: 0.92, opacity: 0, ease: 'power1.in' }, 0.1)
        .to('.hero-fade', { opacity: 1 }, 0.65);

    // ===== 02: kelimeler sırayla belirginleşir =====
    const aboutWords = split(document.querySelector('.about-text'), false);
    gsap.timeline({ scrollTrigger: { trigger: '#hakkimda', start: 'top top', end: '+=160%', scrub: 1, pin: true } })
        .from('.about-kicker', { opacity: 0, y: 30 })
        .fromTo(aboutWords, { opacity: 0.12 }, { opacity: 1, stagger: 0.1, ease: 'none' })
        .from('.about-facts li', { opacity: 0, y: 30, stagger: 0.25 });

    // ===== 03: yatay kayan projeler =====
    const track = document.querySelector('.projects-track');
    const distance = () => track.scrollWidth - window.innerWidth;
    const hScroll = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: { trigger: '#projeler', start: 'top top', end: () => '+=' + distance(), scrub: 1, pin: true, invalidateOnRefresh: true }
    });
    gsap.utils.toArray('.project-panel').forEach(panel => {
        gsap.from(panel.querySelectorAll('.reveal'), {
            y: 70, opacity: 0, stagger: 0.08,
            scrollTrigger: { trigger: panel, containerAnimation: hScroll, start: 'left 80%', end: 'left 20%', scrub: 1 }
        });
        gsap.fromTo(panel.querySelector('.mockup'), { xPercent: 25, rotateY: -28, rotateZ: 4 }, {
            xPercent: -15, rotateY: 14, rotateZ: -2, ease: 'none',
            scrollTrigger: { trigger: panel, containerAnimation: hScroll, start: 'left right', end: 'right left', scrub: true }
        });
    });
    gsap.from('.panel-intro .panel-heading', {
        xPercent: -20, opacity: 0,
        scrollTrigger: { trigger: '#projeler', start: 'top 70%', end: 'top top', scrub: 1 }
    });

    // ===== 04: kayan dev yazılar + teknoloji kartları =====
    gsap.to('.row-a', { xPercent: -35, ease: 'none', scrollTrigger: { trigger: '#teknolojiler', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    gsap.fromTo('.row-b', { xPercent: -35 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '#teknolojiler', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    gsap.from('.skills-inner .kicker, .skills-inner .section-heading', {
        y: 60, opacity: 0, stagger: 0.1,
        scrollTrigger: { trigger: '.skills-inner', start: 'top 85%', end: 'top 45%', scrub: 1 }
    });
    gsap.from('.skill-card', {
        y: 120, rotateX: -35, opacity: 0, stagger: 0.12,
        scrollTrigger: { trigger: '.skills-grid', start: 'top 90%', end: 'top 35%', scrub: 1 }
    });

    // ===== 05: iletişim içeriği yukarı süzülerek gelir =====
    gsap.from('.finale > *', {
        y: 60, opacity: 0, stagger: 0.12,
        scrollTrigger: { trigger: '#iletisim', start: 'top 75%', end: 'top 20%', scrub: 1 }
    });

    // ===== Alt bant: bölüm adı, aktif menü ve ilerleme =====
    const label = document.querySelector('.scene-label');
    const menuLinks = document.querySelectorAll('#nav-links a');
    document.querySelectorAll('.scene').forEach(scene => {
        // Sabitlenen bölümlerde pin-spacer, sabit kalınan süreyi de kapsar
        const spacer = scene.parentElement.classList.contains('pin-spacer') ? scene.parentElement : scene;
        ScrollTrigger.create({
            trigger: spacer, start: 'top center', end: 'bottom center',
            onToggle: self => {
                if (!self.isActive) return;
                label.textContent = scene.dataset.label;
                menuLinks.forEach(a => a.classList.toggle('active-link', a.getAttribute('href') === '#' + scene.id));
            }
        });
    });

    const fill = document.querySelector('.progress-fill');
    const pct = document.querySelector('.progress-pct');
    ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: self => {
            fill.style.transform = `scaleX(${self.progress})`;
            pct.textContent = Math.round(self.progress * 100) + '%';
        }
    });

    // Fontlar yüklenince ölçüler değişir; pin noktalarını yeniden hesapla
    document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
});
