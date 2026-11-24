(() => {
    const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const E = 'cubic-bezier(.2,.8,.2,1)';

    // ---- Giriş: bir kez çalışır; font/foto gecikirse 2.5 sn sonra yine başlar ----
    let entered = false;
    function enter() {
        if (entered) return;
        entered = true;
        if (RM) { $$('.title .line, .in, .hero-photo').forEach(el => { el.style.transform = 'none'; el.style.opacity = 1; }); return; }
        const anim = (el, kf, o) => el.animate(kf, { fill: 'both', easing: E, ...o });
        $$('.title .line').forEach((l, i) => anim(l, [{ transform: 'translateY(150%)' }, { transform: 'none' }], { duration: 1000, delay: 120 + i * 110 }));
        anim($('.hero-photo'), [{ opacity: 0, translate: '0 40px', filter: 'grayscale(1) blur(12px)' }, { opacity: 1, translate: '0 0', filter: 'grayscale(1) contrast(1.08) brightness(1.04)' }], { duration: 1300 });
        $$('.in').forEach((el, i) => anim(el, [{ opacity: 0, translate: '0 14px' }, { opacity: 1, translate: '0 0' }], { duration: 700, delay: 300 + i * 55 }));
        anim($('.r-line i'), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(.62)' }], { duration: 1400, delay: 900 });
        $$('.stats [data-count]').forEach(countUp);
    }
    const photo = $('.hero-photo');
    Promise.race([
        Promise.all([document.fonts ? document.fonts.ready : 0, photo.complete ? 0 : new Promise(r => { photo.onload = photo.onerror = r; })]),
        new Promise(r => setTimeout(r, 2500))
    ]).then(() => requestAnimationFrame(enter));
    setTimeout(enter, 4000);

    // ---- Sayaç ----
    function countUp(el) {
        const to = +el.dataset.count;
        if (RM) return void (el.textContent = to);
        const t0 = performance.now();
        const tick = t => {
            const p = Math.min(1, (t - t0) / 1400);
            el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }
    const io = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return;
        $$('[data-count]', e.target).forEach(countUp);
        io.unobserve(e.target);
    }), { threshold: .35 });
    io.observe($('.t-cards'));

    // ---- Kayan siyah hap menü ----
    const nav = $('.pillnav'), bg = $('.pill-bg'), links = $$('a', nav);
    let active = links[0];
    const moveTo = a => {
        bg.style.width = a.offsetWidth + 'px';
        bg.style.transform = `translateX(${a.offsetLeft}px)`;
        links.forEach(l => l.classList.toggle('hot', l === a));
    };
    links.forEach(a => {
        a.addEventListener('mouseenter', () => moveTo(a));
        a.addEventListener('focus', () => moveTo(a));
        a.addEventListener('click', () => { active = a; });
    });
    nav.addEventListener('mouseleave', () => moveTo(active));
    addEventListener('resize', () => moveTo(active));
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => moveTo(active));

    // ---- Manifesto: kelimeler okuma sırasıyla griden beyaza dolar ----
    const fill = $('.fill');
    const text = fill.textContent.trim();
    fill.setAttribute('aria-label', text);
    fill.innerHTML = text.split(/\s+/).map(w => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
    const words = $$('.w', fill);

    // ---- Kaydırmaya bağlı her şey tek rAF'ta ----
    const cards = $$('.proj');
    let ticking = false;
    function onScroll() {
        ticking = false;
        const vh = innerHeight, y = scrollY;
        if (!RM) photo.style.transform = `translateY(${y * .12}px)`;

        const r = fill.getBoundingClientRect();
        // shortcut: doğrusal ilerleme; paragraf ekranın %85'inden %35'ine gelirken dolar
        const p = RM ? 1 : Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .5)));
        const n = p * (words.length + 3);
        words.forEach((w, i) => {
            const k = Math.min(1, Math.max(0, (n - i) / 3)); // 3 kelimelik yumuşak kenar
            const c = Math.round(111 + (244 - 111) * k);
            w.style.color = `rgb(${c},${c},${c})`;
        });

        // Yapışkan kartlar: üstüne binen kart geldikçe alttaki hafifçe küçülür
        if (!RM && innerWidth > 760) cards.forEach((c, i) => {
            const next = cards[i + 1];
            if (!next) return;
            const d = next.getBoundingClientRect().top - c.getBoundingClientRect().top;
            const q = Math.min(1, Math.max(0, 1 - d / c.offsetHeight));
            c.style.transform = `scale(${1 - q * .06})`;
            c.style.filter = `brightness(${1 - q * .45})`;
        });
    }
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();
})();
