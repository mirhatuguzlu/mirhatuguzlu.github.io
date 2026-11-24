// Kaf'ın Yedi Kapısı tanıtım sayfası: dağ çizimi, yedi kapı sahnesi ve örnek oda. Kütüphanesiz.
(() => {
  const azHareket = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const kapiRenk = ['#c27c45', '#c3cbd4', '#e0b252', '#9ad8ea', '#a7adb6', '#b09ce0', '#4fc795'];

  // 1) Açılış: dağ alttan yukarı kendini çizer, kapılar sırayla yanar, zirvede Zümrüdüanka parlar.
  const dag = document.querySelector('.dag');
  if (dag) {
    const satirlar = dag.textContent.replace(/^\n/, '').replace(/\s+$/, '').split('\n');
    const kapilar = [];
    satirlar.forEach((s, r) => { for (const m of s.matchAll(/\[ \]/g)) kapilar.push({ r, c: m.index }); });
    kapilar.sort((a, b) => b.r - a.r || a.c - b.c);
    const kapiSira = new Map(kapilar.map((k, i) => [k.r + ':' + k.c, i]));
    const n = satirlar.length;
    const parca = [];
    satirlar.forEach((s, r) => {
      for (let c = 0; c < s.length; c++) {
        const ch = s[c];
        if (ch === ' ') { parca.push(' '); continue; }
        const k = kapiSira.get(r + ':' + c);
        if (k !== undefined) {
          parca.push(`<span class="h kapi-isik" style="--kc:${kapiRenk[k]};--d:${(1.25 + k * 0.09).toFixed(2)}s">[ ]</span>`);
          c += 2;
          continue;
        }
        let sinif = 'h';
        let d = (n - 1 - r) * 0.075 + c * 0.003;
        if (ch === '@') { sinif += ' zirve'; d = 1.95; }
        else if ((ch === '*' || ch === '.') && !/[\/\\]/.test(s.slice(Math.max(0, c - 3), c + 4))) { sinif += ' yildiz'; d = 0.2 + Math.random() * 1.4; }
        parca.push(`<span class="${sinif}" style="--d:${d.toFixed(2)}s">${ch}</span>`);
      }
      parca.push('\n');
    });
    dag.innerHTML = parca.join('');
  }

  // 2) Yedi kapı: sahne sabit kalır, kaydırdıkça bir sonraki kapıya geçilir.
  const bolum = document.querySelector('.kapilar');
  const liste = bolum && [...bolum.querySelectorAll('.liste > .kapi')];
  const merdiven = bolum && bolum.querySelector('.merdiven');
  if (liste && liste.length && merdiven) {
    const hedefler = liste.map((li) => {
      const pre = li.querySelector('pre');
      pre.textContent = pre.textContent.replace(/^\n/, '');
      return pre.textContent;
    });
    const dugmeler = liste.map((li, i) => {
      const item = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.style.setProperty('--kc', kapiRenk[i]);
      b.textContent = li.querySelector('h3').textContent;
      b.addEventListener('click', () => {
        const ust = bolum.getBoundingClientRect().top + scrollY;
        const aralik = bolum.offsetHeight - innerHeight;
        scrollTo({ top: ust + aralik * ((i + 0.5) / liste.length), behavior: azHareket ? 'auto' : 'smooth' });
      });
      item.append(b);
      merdiven.append(item);
      return b;
    });

    const isaret = '/\\|_-~^.*';
    let etkin = -1;
    let kare = 0;
    const karistir = (pre, eski, yeni) => {
      cancelAnimationFrame(kare);
      if (azHareket) { pre.textContent = yeni; return; }
      const a = eski.split('\n'), b = yeni.split('\n');
      const h = Math.max(a.length, b.length);
      const w = Math.max(...a.concat(b).map((s) => s.length));
      const pad = (s) => (s || '').padEnd(w, ' ');
      const kaynak = Array.from({ length: h }, (_, r) => pad(a[r])).join('\n');
      const hedef = Array.from({ length: h }, (_, r) => pad(b[r])).join('\n');
      const esik = [...hedef].map((_, k) => (k / hedef.length) * 0.7 + Math.random() * 0.3);
      const bas = performance.now();
      const adim = (t) => {
        const p = Math.min(1, (t - bas) / 520);
        let out = '';
        for (let k = 0; k < hedef.length; k++) {
          const ch = hedef[k];
          if (ch === '\n') { out += ch; continue; }
          if (p >= esik[k]) out += ch;
          else if (ch === ' ' && kaynak[k] === ' ') out += ' ';
          else out += p > esik[k] - 0.25 ? isaret[(Math.random() * isaret.length) | 0] : kaynak[k];
        }
        pre.textContent = out;
        if (p < 1) kare = requestAnimationFrame(adim);
        else pre.textContent = yeni;
      };
      kare = requestAnimationFrame(adim);
    };

    const goster = (i) => {
      if (i === etkin) return;
      const onceki = etkin;
      etkin = i;
      liste.forEach((li, k) => li.classList.toggle('etkin', k === i));
      dugmeler.forEach((b, k) => {
        b.classList.toggle('gecildi', k < i);
        if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      });
      karistir(liste[i].querySelector('pre'), onceki < 0 ? hedefler[i].replace(/\S/g, ' ') : hedefler[onceki], hedefler[i]);
    };
    const olc = () => {
      const r = bolum.getBoundingClientRect();
      const aralik = bolum.offsetHeight - innerHeight;
      const p = aralik > 0 ? Math.min(0.9999, Math.max(0, -r.top / aralik)) : 0;
      goster(Math.floor(p * liste.length));
    };
    addEventListener('scroll', olc, { passive: true });
    addEventListener('resize', olc);
    olc();
  }

  // 3) Örnek oda: seçim + yirmi yüzlü zar, oyundaki satır biçimiyle.
  const secimler = document.getElementById('secimler');
  if (secimler) {
    const anlat = document.getElementById('anlat');
    const zar = document.getElementById('zar');
    const sonuc = document.getElementById('sonuc');
    const can = document.getElementById('can');
    const altin = document.getElementById('altin');
    const ilk = { anlat: anlat.textContent, secim: secimler.innerHTML, can: can.textContent, altin: altin.textContent };
    const d20 = () => 1 + ((Math.random() * 20) | 0);

    const uygula = (etki) => {
      const [ne, deger] = etki.split(':');
      const v = parseInt(deger, 10);
      if (ne === 'can') {
        const [c, m] = can.textContent.split('/').map(Number);
        can.textContent = `${Math.max(0, Math.min(m, c + v))}/${m}`;
        return `${v > 0 ? '+' : '−'}${Math.abs(v)} Can`;
      }
      altin.textContent = String(Number(altin.textContent) + v);
      return `+${v} Altın`;
    };

    secimler.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.yeniden !== undefined) {
        anlat.textContent = ilk.anlat; secimler.innerHTML = ilk.secim;
        can.textContent = ilk.can; altin.textContent = ilk.altin;
        zar.textContent = ''; sonuc.textContent = '';
        secimler.querySelector('button').focus();
        return;
      }
      const { stat, bonus, hedef } = b.dataset;
      secimler.querySelectorAll('button').forEach((x) => { x.disabled = true; });
      sonuc.textContent = '';
      const bitir = () => {
        zar.removeAttribute('aria-busy');
        const die = d20();
        const top = die + Number(bonus);
        const ok = top >= Number(hedef);
        zar.innerHTML = `Zar: <span class="z">${die}</span> + ${stat} ${bonus} = ${top} (hedef ${hedef}) — <span class="${ok ? 'iyi' : 'kotu'}">${ok ? 'başarılı' : 'başarısız'}</span>`;
        const etki = uygula(ok ? b.dataset.iyiEtki : b.dataset.kotuEtki);
        anlat.textContent = ok ? b.dataset.iyi : b.dataset.kotu;
        sonuc.textContent = etki;
        secimler.innerHTML = '<button class="secim" type="button" data-yeniden><span>Bir daha dene</span><small>aynı oda, yeni zar</small></button>';
        secimler.querySelector('button').focus();
      };
      if (azHareket) return bitir();
      zar.setAttribute('aria-busy', 'true');
      const bas = performance.now();
      const don = (t) => {
        if (t - bas > 650) return bitir();
        zar.innerHTML = `Zar: <span class="z">${d20()}</span>`;
        requestAnimationFrame(don);
      };
      requestAnimationFrame(don);
    });
  }
})();
