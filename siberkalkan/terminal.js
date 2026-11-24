'use strict';
// Siber Kalkan tanıtım terminali. Bağımlılık yok, ağ isteği yok; her şey bu dosyada.

const PLAY = 'https://play.google.com/store/apps/details?id=com.siberkalkan.siber_kalkan';
const EPOSTA = 'dev.mirhat@gmail.com'; // gizlilik, şartlar ve hesap silme sayfalarında da aynı adres
const BAYRAKLAR = ['KALKAN{ilk_adim_terminal}', 'KALKAN{nokta_ile_baslayan_dosyalar}'];

const ekran = document.getElementById('ekran');
const form = document.getElementById('form');
const girdi = document.getElementById('girdi');
const istemYol = document.getElementById('istem-yol');
const azHareket = matchMedia('(prefers-reduced-motion: reduce)').matches;
const inceImlec = matchMedia('(pointer: fine)').matches;

// ---------- Yardımcılar ----------
const kac = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
/** Dokunulabilir komut: terminal bilmeyen de tıklayarak gezer. */
const k = (komut, etiket = komut) => `<button type="button" data-komut="${kac(komut)}">${kac(etiket)}</button>`;
const renk = (sinif, metin) => `<span class="${sinif}">${metin}</span>`;
const bekle = (ms) => new Promise((r) => setTimeout(r, azHareket ? 0 : ms));
/** Komut adında Türkçe harf ve büyük harf farkı önemsiz: "Yardım" = "yardim". */
const sade = (s) => s.toLocaleLowerCase('tr').replace(/[ıİ]/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');

function yaz(html = '', sinif = '') {
  const d = document.createElement('div');
  d.className = 'satir' + (sinif ? ' ' + sinif : '');
  d.innerHTML = html;
  ekran.appendChild(d);
  ekran.scrollTop = ekran.scrollHeight;
  return d;
}
const not = (html) => yaz(`<div class="not">${html}</div>`);

// ---------- Sahte dosya sistemi (~ = /home/stajyer) ----------
const oyun = (ad, konu, oynanis, ek = '') =>
  `${renk('k-mavi k-kalin', ad)}\n${renk('k-soluk', 'Öğrettiği:')} ${konu}\n${renk('k-soluk', 'Oynanış:')}  ${oynanis}${ek ? '\n\n' + ek : ''}\n\n${renk('k-soluk', 'Sıradaki:')} ${k('ls ~/oyunlar', 'diğer oyunlar')}  ${k('./indir.sh', 'uygulamayı indir')}`;

const FS = {
  'hikaye.txt':
    `${renk('k-sari k-kalin', 'GÖREV DOSYASI — KSOM / gizlilik derecesi: stajyer')}\n\n` +
    `Kalkan Siber Operasyon Merkezi'ne hoş geldin.\n` +
    `${renk('k-kirmizi', 'Gölge Ağ')} adlı saldırgan grup şirketlere ve şehre art arda saldırıyor.\n` +
    `Kıdemli analist ${renk('k-sari', 'Defne')} her görevden önce sana brifing veriyor. Sen saldırıyı\n` +
    `durduruyor, rütbe atlıyor ve finalde Gölge Ağ'ın liderinin kimliğini ortaya çıkarıyorsun.\n\n` +
    `${renk('k-mavi', '8 bölüm · 48 görev · her görevde 1–3 yıldız')}\n` +
    ` 1 Oltalama Dalgası    2 Zayıf Halka       3 Kapıdaki Düşman   4 Kod Çözücü\n` +
    ` 5 Sızma               6 Sosyal Mühendis   7 Fidye Saati       8 Gölge Ağ\n\n` +
    `Her bölüm bir patron göreviyle biter. Her cevaptan sonra kısa bir "Neden?" açıklaması gelir:\n` +
    `oynarken gerçekten öğrenirsin. Bir tur 2–5 dakika sürer.\n\n` +
    `${renk('k-soluk', 'Sıradaki:')} ${k('ls ~/oyunlar', 'mini oyunlar')}  ${k('ls ~/modlar', 'modlar')}  ${k('cat ~/rutbeler.txt', 'rütbeler')}`,
  oyunlar: {
    'oltalama-avcisi.txt': oyun('Oltalama Avcısı', 'kimlik avı e-postaları, SMS ve sahte siteler',
      'Gelen e-postayı incele. Şüpheli gönderene, linke, aciliyet diline ya da eke dokun,\n           sonra "Güvenli" ya da "Oltalama" diye karar ver. Kuyruk dolmadan yetiş.'),
    'guvenlik-duvari.txt': oyun('Güvenlik Duvarı', 'port, protokol, IP, kural mantığı ve DDoS',
      'Ekrandan akan paketlere kurala göre "İzin ver" ya da "Engelle" de.\n           Dalgalar geldikçe hızlanır.'),
    'terminal-sizma.txt': oyun('Terminal Sızma', 'temel komutlar, log ve dosya inceleme, CTF mantığı',
      'Simüle bir terminalde ls, cd, cat, grep, whoami ile sahte bir sunucuyu gez\n           ve KALKAN{...} bayrağını bul.',
      `${renk('k-sari', 'Şu an kullandığın terminal onun küçük kardeşi.')} Denemek için: ${k('rehber')}`),
    'sifre-atolyesi.txt': oyun('Şifre Atölyesi', 'güçlü parola, kaba kuvvet ve sözlük saldırısı',
      'Kurallara uyan bir parola kur ve "kırılma süresi" sayacını yen.\n           Zayıf parolaları güçten güce sırala.',
      renk('k-kirmizi', 'Oyunda bile gerçek parolanı yazma. Klavyenin de öğrenmesine izin verilmez.')),
    'kripto-bulmacalari.txt': oyun('Kripto Bulmacaları', 'Sezar, Base64, XOR ve hash kavramı',
      'Şifreli mesajı çark ve tablo gibi görsel araçlarla çöz.',
      `Küçük bir tadımlık: ${renk('k-mavi', 'Nhonkq')} (Sezar, 3 geri) → ${renk('k-yesil', 'Kalkan')}`),
    'olay-mudahalesi.txt': oyun('Olay Müdahalesi', 'log analizi, saldırı zinciri ve karantina',
      'Zaman çizelgesi ve loglardan saldırının kök nedenini bul, müdahale adımlarını\n           doğru sıraya koy. Hasar sayacı işliyor.'),
  },
  modlar: {
    'kampanya.txt': `${renk('k-mavi k-kalin', 'Kampanya')}\n8 bölüm, 48 görev. Yıldız topladıkça yeni bölümler açılır, her bölümün sonunda\nbirkaç mini oyunu karıştıran bir patron görevi var.`,
    'zamana-karsi.txt': `${renk('k-mavi k-kalin', 'Zamana Karşı')}\nSüre işlerken karışık, hızlı sorular. Doğru cevaplar art arda gelirse kombo çarpanı büyür.`,
    'hayatta-kalma.txt': `${renk('k-mavi k-kalin', 'Hayatta Kalma')}\nGüvenlik Duvarı'nın bitmeyen hâli. Üç hatada sunucu düşer, her dalga biraz daha hızlı.\nNe kadar dayanabilirsin?`,
    'gunluk-gorev.txt': `${renk('k-mavi k-kalin', 'Günlük Görev')}\nHer gün herkes için aynı görev. Art arda günlerde bitirirsen serin büyür.`,
    'serbest-pratik.txt': `${renk('k-mavi k-kalin', 'Serbest Pratik')}\nAçtığın mini oyunları süre ve can derdi olmadan, rahatça oyna.`,
  },
  'rutbeler.txt': null, // aşağıda çubuklarla üretilir
  'sss.txt':
    `${renk('k-sari', 'Ücretli mi?')}\n  Hayır, ücretsiz. Reklam içerir. İstersen tek seferlik "Reklamları kaldır" satın alabilirsin.\n\n` +
    `${renk('k-sari', 'İnternet gerekir mi?')}\n  Evet, açılışta. Oyun sırasında bağlantı koparsa oyunun kesilmez.\n\n` +
    `${renk('k-sari', 'Hesap açmam gerekir mi?')}\n  Hayır. İlerlemen otomatik olarak buluta yedeklenir. Telefon değiştireceksen\n  Ayarlar'dan Google hesabını bağlaman yeter.\n\n` +
    `${renk('k-sari', 'Gerçek hackerlık mı öğretiyor?')}\n  Hayır. Saldırıları tanımayı ve savunmayı öğretir. Oyundaki şirketler, kişiler,\n  e-postalar ve sunucular tamamen kurgusal.\n\n` +
    `${renk('k-sari', 'Kimler için?')}\n  13 yaş ve üstü, siber güvenliğe merak salan herkes. Ön bilgi gerekmez.\n\n` +
    `${renk('k-sari', 'Hangi cihazlarda?')}\n  Android telefon ve tabletlerde, Google Play üzerinden.\n\n` +
    `${renk('k-sari', 'Verilerim ne oluyor?')}\n  ${k('cat ~/gizlilik.txt', 'gizlilik özeti')}  ${k('cat ~/hesap-silme.txt', 'hesabımı nasıl silerim?')}`,
  'gizlilik.txt':
    `${renk('k-mavi k-kalin', 'Gizlilik — kısa özet')}\n` +
    `• Oyun ilerlemen (yıldız, puan, XP, rozet, mod rekorları) cihazında tutulur ve\n  Avrupa'daki (Frankfurt) sunucumuza yedeklenir.\n` +
    `• Ad, telefon, konum, kişiler, kamera, mikrofon: hiçbirini istemeyiz.\n` +
    `• Google hesabını bağlarsan e-posta adresin hesabınla eşleşir.\n` +
    `• Reklamları Google AdMob gösterir. Kişiselleştirme onayını uygulamada verir ya da geri çekersin.\n` +
    `• Bu site çerez kullanmaz, seni izlemez, dışarıya istek atmaz.\n\n` +
    `Tam metin: ${k('gizlilik', 'gizlilik politikasını aç')}`,
  'hesap-silme.txt':
    `${renk('k-mavi k-kalin', 'Hesap silme')}\n` +
    `Uygulamada: ${renk('k-sari', 'Ayarlar → Hesap ve bulut kaydı → Hesabımı ve bulut kaydımı sil')}\n` +
    `Hesabın, bulut kaydın ve cihazdaki ilerlemen anında ve kalıcı olarak silinir.\n\n` +
    `Ayrıntılar ve uygulama yüklü değilse: ${k('hesap-sil', 'hesap silme sayfasını aç')}`,
  'indir.sh': `#!/bin/sh\n# Siber Kalkan'ı Google Play'den indir\nopen ${PLAY}\n\n${renk('k-soluk', 'Çalıştırmak için:')} ${k('./indir.sh')}`,
  '.gizli': {
    'bayrak.txt':
      `${renk('k-yesil', 'Gizli klasörü buldun!')}\n` +
      `Adı nokta ile başlayan dosyalar normal ls'te görünmez; ${renk('k-mavi', 'ls -a')} hepsini gösterir.\n` +
      `Saldırganlar da izlerini çoğu zaman böyle saklar. Bir analist her zaman -a ile bakar.\n\n` +
      `${renk('k-yesil k-kalin', BAYRAKLAR[1])}\nTeslim et: ${k('teslim ' + BAYRAKLAR[1])}`,
  },
};

const RUTBELER = [['Stajyer', 0], ['Junior Analist', 300], ['Analist', 1500], ['Kıdemli Analist', 3500], ['Tehdit Avcısı', 6000], ['Siber Kalkan', 9000]];
FS['rutbeler.txt'] =
  `${renk('k-mavi k-kalin', 'Rütbe merdiveni')} ${renk('k-soluk', '(gereken toplam XP)')}\n\n` +
  RUTBELER.map(([ad, xp], i) => {
    const dolu = Math.max(1, Math.round((xp / 9000) * 24));
    const cubuk = renk(i === RUTBELER.length - 1 ? 'k-sari' : 'k-mavi', '█'.repeat(dolu)) + renk('k-soluk', '░'.repeat(24 - dolu));
    return `${ad.padEnd(16)} ${cubuk} ${String(xp).padStart(5)}`;
  }).join('\n') +
  `\n\nGörev geçtikçe XP kazanırsın. Kampanyayı iyi oynayarak bitiren Tehdit Avcısı olur,\n${renk('k-sari', 'Siber Kalkan')} unvanı ise tekrar ve modlarla gelir. Yol boyunca kampanya, bölüm,\nuzmanlık ve mod rozetleri toplarsın.`;

let cwd = []; // ~ altındaki yol

/** "~/oyunlar", "..", "oyunlar/x.txt" gibi yolları çözer; yoksa null. */
function coz(yol = '') {
  let parca = yol.startsWith('~') || yol.startsWith('/') ? [] : [...cwd];
  for (const p of yol.replace(/^~\/?|^\/+/, '').split('/')) {
    if (!p || p === '.') continue;
    if (p === '..') parca.pop();
    else parca.push(p);
  }
  let dugum = FS;
  for (const p of parca) {
    if (!dugum || typeof dugum !== 'object' || !(p in dugum)) return null;
    dugum = dugum[p];
  }
  return { parca, dugum, klasor: typeof dugum === 'object' };
}
const tamYol = (parca) => '~' + (parca.length ? '/' + parca.join('/') : '');

// ---------- Komutlar ----------
let gecmis = [];
const bulunan = new Set();

const KOMUTLAR = {
  help: { a: 'Komutları listeler. Bir komutun ayrıntısı için: help ls', kul: 'help [komut]', calis: yardim },
  rehber: { a: 'Terminali hiç bilmiyorsan: adım adım, oynayarak öğren', kul: 'rehber  |  rehber bitir', calis: rehberBaslat },
  ls: { a: 'Bulunduğun klasördeki dosyaları listeler (-a gizlileri de gösterir)', kul: 'ls [-a] [klasör]', calis: ls },
  cd: { a: 'Bir klasöre girer. cd .. bir üst klasöre, cd tek başına eve döner', kul: 'cd <klasör>', calis: cd },
  cat: { a: 'Bir dosyanın içini ekrana yazar', kul: 'cat <dosya>', calis: cat },
  pwd: { a: 'Şu an hangi klasörde olduğunu söyler', kul: 'pwd', calis: () => yaz('/home/stajyer' + tamYol(cwd).slice(1)) },
  whoami: { a: 'Kim olduğunu söyler', kul: 'whoami', calis: () => yaz(`stajyer — KSOM'un en yeni analisti. Rütbe: ${renk('k-sari', 'Stajyer')} (0 XP).\nRütbe atlamak için: ${k('./indir.sh')}`) },
  indir: { a: 'Siber Kalkan\'ı Google Play\'den indir', kul: 'indir  |  ./indir.sh', calis: indir },
  gizlilik: { a: 'Gizlilik politikasını açar', kul: 'gizlilik', calis: () => git('gizlilik.html') },
  sartlar: { a: 'Kullanım şartlarını açar', kul: 'sartlar', calis: () => git('kullanim-sartlari.html') },
  'hesap-sil': { a: 'Hesabını ve verilerini nasıl sileceğini anlatan sayfayı açar', kul: 'hesap-sil', calis: () => git('hesap-silme.html') },
  iletisim: { a: 'Bize nasıl ulaşacağını gösterir', kul: 'iletisim', calis: () => yaz(`Hata, öneri ya da veri talebi için: <a href="mailto:${EPOSTA}">${EPOSTA}</a>`) },
  teslim: { a: 'Bulduğun KALKAN{...} bayrağını teslim eder', kul: 'teslim KALKAN{...}', calis: teslim },
  gecmis: { a: 'Daha önce yazdığın komutları listeler (↑ ve ↓ tuşları da gezer)', kul: 'gecmis', calis: () => yaz(gecmis.map((g, i) => `${String(i + 1).padStart(3)}  ${kac(g)}`).join('\n') || renk('k-soluk', 'Henüz komut yok.')) },
  tarih: { a: 'Tarihi ve saati gösterir', kul: 'tarih', calis: () => yaz(new Date().toLocaleString('tr-TR', { dateStyle: 'full', timeStyle: 'short' })) },
  temizle: { a: 'Ekranı temizler (Ctrl+L de olur)', kul: 'temizle', calis: () => { ekran.innerHTML = ''; } },
};
const TAKMA = { yardim: 'help', '?': 'help', clear: 'temizle', history: 'gecmis', date: 'tarih', './indir.sh': 'indir', 'sh indir.sh': 'indir', sil: 'hesap-sil', kvkk: 'gizlilik', privacy: 'gizlilik' };
// Yardımda listelenmeyenler: meraklısı bulsun.
const GIZLI = {
  sudo: () => yaz(`[sudo] stajyer için parola: ${renk('k-kirmizi', 'DUR!')}\nParolanı hiçbir terminale bu kadar kolay yazma. Ayrıca stajyerin sudo yetkisi yok;\nbu olay Defne'ye bildirildi. ${renk('k-soluk', '(Şaka. Ama parola kısmı değil.)')}`),
  rm: () => yaz(`rm: Burada her şey salt okunur. Gölge Ağ değilsen dosya silmene gerek yok.`),
  exit: () => yaz(`Kalkan nöbeti bırakmaz. ${renk('k-soluk', '(Sekmeyi kapatabilirsin ama.)')}`),
  echo: (arg) => yaz(kac(arg.join(' '))),
  kalkan: () => logoCiz(),
  ping: (arg) => yaz(arg[0] && sade(arg[0]).includes('golge') ? `${renk('k-kirmizi', 'Gölge Ağ')} cevap vermiyor. Sessizlik de bir ipucudur.` : `ping: ${kac(arg[0] || 'ksom')} — 64 bayt, süre=1 ms. Kalkan ayakta.`),
};

function yardim([ad]) {
  if (ad) {
    const n = TAKMA[sade(ad)] || sade(ad);
    const c = KOMUTLAR[n];
    if (!c) return yaz(`help: ${kac(ad)} diye bir komut yok. Hepsi için: ${k('help')}`);
    return yaz(`${renk('k-mavi k-kalin', n)} — ${c.a}\n${renk('k-soluk', 'Kullanım:')} ${kac(c.kul)}`);
  }
  yaz(`${renk('k-sari k-kalin', 'Komutlar')} ${renk('k-soluk', '— adına dokunursan çalışır')}`);
  yaz(`<div class="tablo">${Object.entries(KOMUTLAR).map(([n, c]) => `<span>${k(n)}</span><span>${c.a}</span>`).join('')}</div>`);
  yaz(`${renk('k-soluk', 'Kısayollar:')} Tab tamamlar · ↑ ↓ geçmişte gezer · Ctrl+L temizler\n${renk('k-soluk', 'Türkçe harfler sorun değil: "yardım" da çalışır. Birkaç gizli komut da var; bulabilirsen.')}`);
}

function ls(arg) {
  const hepsi = arg.includes('-a') || arg.includes('-la') || arg.includes('-al');
  const hedef = arg.find((a) => !a.startsWith('-'));
  const r = coz(hedef || '');
  if (!r) return yaz(`ls: '${kac(hedef)}' diye bir dosya ya da klasör yok`, 'k-kirmizi');
  if (!r.klasor) return yaz(k('cat ' + tamYol(r.parca), r.parca.at(-1)));
  const adlar = Object.keys(r.dugum).filter((a) => hepsi || !a.startsWith('.'));
  yaz(adlar.map((a) => {
    const yol = tamYol([...r.parca, a]);
    return typeof r.dugum[a] === 'object' ? k('ls ' + yol, a + '/') : k('cat ' + yol, a);
  }).join('   '));
}

function cd([hedef]) {
  const r = coz(hedef || '~');
  if (!r) return yaz(`cd: '${kac(hedef)}' diye bir klasör yok`, 'k-kirmizi');
  if (!r.klasor) return yaz(`cd: ${kac(hedef)} bir klasör değil, dosya. Okumak için: ${k('cat ' + tamYol(r.parca))}`);
  cwd = r.parca;
  istemYol.textContent = tamYol(cwd);
}

let sonOkunan = null;
function cat([hedef]) {
  if (!hedef) return yaz(`cat: hangi dosya? Örnek: ${k('cat ~/hikaye.txt')}`);
  const r = coz(hedef);
  if (!r) return yaz(`cat: '${kac(hedef)}' diye bir dosya yok. Etrafına bak: ${k('ls')}`, 'k-kirmizi');
  if (r.klasor) return yaz(`cat: ${kac(hedef)} bir klasör. İçine bakmak için: ${k('ls ' + tamYol(r.parca))}`);
  sonOkunan = r.parca.join('/');
  yaz(r.dugum);
}

function indir() {
  yaz(`Google Play'e bağlanılıyor… ${renk('k-yesil', 'tamam')}`);
  yaz(`<a class="k-kalin" href="${PLAY}" target="_blank" rel="noopener">Siber Kalkan'ı Google Play'de aç</a> ${renk('k-soluk', '(yayına çıkınca bu bağlantı çalışacak)')}`);
}

function git(sayfa) {
  yaz(`${sayfa} açılıyor…`, 'k-soluk');
  setTimeout(() => { location.href = sayfa; }, azHareket ? 0 : 350);
}

function teslim([bayrak]) {
  if (!bayrak) return yaz(`teslim: bayrağı yaz. Örnek: teslim KALKAN{...}`);
  if (!BAYRAKLAR.includes(bayrak)) return yaz(`${renk('k-kirmizi', 'Yanlış bayrak.')} Bayraklar büyük-küçük harfe duyarlıdır, tam yazmalısın.`);
  bulunan.add(bayrak);
  yaz(`${renk('k-yesil k-kalin', '✔ Bayrak kabul edildi!')} Bulunan: ${bulunan.size}/${BAYRAKLAR.length}` +
    (bulunan.size === BAYRAKLAR.length ? `\n${renk('k-sari', 'Hepsini buldun. Defne etkilendi. Asıl görevler uygulamada:')} ${k('./indir.sh')}` : `\n${renk('k-soluk', 'Biri daha saklı. İpucu: her şey görünmez.')}`));
}

// ---------- Rehber: terminali hiç bilmeyene adım adım ----------
const REHBER = [
  {
    not: `<b>Defne:</b> Merhaba stajyer! Terminal, bilgisayara fareyle değil <b>yazarak</b> emir verdiğin bir pencere. ` +
      `Aşağıdaki <code>stajyer@ksom:~$</code> satırına <b>istem</b> denir: "Ben stajyer, KSOM'dayım, evimdeyim (<code>~</code>), emrini bekliyorum" der.<br><br>` +
      `İlk emrin: <code>whoami</code> yaz ve Enter'a bas. Bu, "ben kimim?" demek.`,
    komut: 'whoami', tamam: (c) => c.ad === 'whoami',
  },
  {
    not: `<b>Defne:</b> İşte bu! Her komut bir <b>fiil</b> gibidir: bilgisayara ne yapacağını söyler.<br><br>` +
      `Şimdi etrafına bak: <code>ls</code> yaz. ("list" yani listele.) Bulunduğun klasördeki her şeyi gösterir.`,
    komut: 'ls', tamam: (c) => c.ad === 'ls',
  },
  {
    not: `<b>Defne:</b> Sonu <code>/</code> ile bitenler <b>klasör</b>, diğerleri <b>dosya</b>.<br><br>` +
      `Bir dosyayı okumak için <code>cat</code> ve dosyanın adını yaz: <code>cat hikaye.txt</code>. ` +
      `Komuttan sonra boşlukla yazdığın kısma <b>argüman</b> denir; komuta neyle çalışacağını söyler.`,
    komut: 'cat hikaye.txt', tamam: (c) => c.ad === 'cat' && sonOkunan === 'hikaye.txt',
  },
  {
    not: `<b>Defne:</b> Görev dosyan bu. Şimdi bir klasöre girelim: <code>cd oyunlar</code>. ("change directory", klasör değiştir.)`,
    komut: 'cd oyunlar', tamam: (c) => c.ad === 'cd' && cwd.join('/') === 'oyunlar',
  },
  {
    not: `<b>Defne:</b> İstem değişti, fark ettin mi? Artık <code>~/oyunlar</code> içindesin. Burada neler var? Yine <code>ls</code>.`,
    komut: 'ls', tamam: (c) => c.ad === 'ls' && cwd.join('/') === 'oyunlar',
  },
  {
    not: `<b>Defne:</b> Bunlar uygulamadaki altı mini oyun; adına dokunursan okursun. Geri dönmek için <code>cd ..</code> yaz. ` +
      `İki nokta "bir üst klasör" demek.`,
    komut: 'cd ..', tamam: (c) => c.ad === 'cd' && cwd.length === 0,
  },
  {
    not: `<b>Defne:</b> Evdesin. Son iki hile: <b>Tab</b> tuşu yarım yazdığını tamamlar, <b>↑</b> tuşu önceki komutu geri getirir. ` +
      `Kaybolursan <code>help</code> her zaman yanında.<br><br>` +
      `Terminal Sızma oyununda amaç bir <b>bayrak</b> bulup teslim etmek. İlk bayrağın benden: <code>${BAYRAKLAR[0]}</code><br>` +
      `Teslim et: <code>teslim ${BAYRAKLAR[0]}</code>`,
    komut: 'teslim ' + BAYRAKLAR[0], tamam: () => bulunan.has(BAYRAKLAR[0]),
  },
];
let rehberAdim = -1;

function rehberGoster() {
  const a = REHBER[rehberAdim];
  yaz(renk('ilerleme', `[rehber ${rehberAdim + 1}/${REHBER.length}]`));
  not(a.not + `<br><br>Yazmak istemezsen dokun: ${k(a.komut)}`);
}
function rehberBaslat([alt]) {
  if (alt && sade(alt) === 'bitir') {
    rehberAdim = -1;
    return yaz(`Rehber kapandı. İstediğin zaman ${k('rehber')} ile dönebilirsin.`);
  }
  rehberAdim = 0;
  rehberGoster();
}
function rehberDenetle(c) {
  if (rehberAdim < 0 || c.ad === 'rehber') return;
  if (!REHBER[rehberAdim].tamam(c)) {
    yaz(renk('k-soluk', `Rehber seni bekliyor: `) + k(REHBER[rehberAdim].komut) + renk('k-soluk', '  (çıkmak için: rehber bitir)'));
    return;
  }
  rehberAdim++;
  if (rehberAdim < REHBER.length) return rehberGoster();
  rehberAdim = -1;
  not(`<b>Defne:</b> Tebrikler, artık terminal kullanabiliyorsun! <code>whoami</code>, <code>ls</code>, <code>cat</code>, <code>cd</code>: ` +
    `uygulamadaki Terminal Sızma görevleri tam olarak bu komutlarla oynanıyor. Bu sitede bir bayrak daha saklı… ` +
    `<code>ls</code> her şeyi göstermiyor olabilir.`);
  yaz(`${k('./indir.sh', 'uygulamayı indir')}  ${k('help', 'tüm komutlar')}`);
}

// ---------- Çalıştırıcı ----------
function uzaklik(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

function calistir(satir) {
  const temiz = satir.trim().replace(/\s+/g, ' ');
  yaz(`<span class="istem">stajyer@ksom:<span class="yol">${kac(tamYol(cwd))}</span>$</span> ${kac(temiz)}`, 'girdi');
  if (!temiz) return;
  gecmis.push(temiz);
  const [ilk, ...arg] = temiz.split(' ');
  const sadeTum = sade(temiz);
  const ad = TAKMA[sadeTum] || TAKMA[sade(ilk)] || sade(ilk);
  if (KOMUTLAR[ad]) KOMUTLAR[ad].calis(arg);
  else if (GIZLI[ad]) GIZLI[ad](arg);
  else {
    const yakin = Object.keys(KOMUTLAR).find((n) => uzaklik(ad, n) <= (ad.length > 4 ? 2 : 1));
    yaz(`${renk('k-kirmizi', 'komut bulunamadı:')} ${kac(ilk)}` + (yakin ? `. Bunu mu demek istedin: ${k(yakin + (arg.length ? ' ' + arg.join(' ') : ''), yakin)}` : `. Komutları görmek için ${k('help')}`));
  }
  rehberDenetle({ ad, arg });
}

// Dokunulan komutu yazıyormuş gibi gösterir, sonra çalıştırır.
let mesgul = false;
async function dokunCalistir(komut) {
  if (mesgul) return;
  mesgul = true;
  await acilisiBitir();
  girdi.value = '';
  for (const h of komut) { girdi.value += h; await bekle(komut.length > 24 ? 12 : 28); }
  await bekle(120);
  girdi.value = '';
  calistir(komut);
  mesgul = false;
  if (inceImlec) girdi.focus();
}

// ---------- Tamamlama ve geçmiş ----------
function tamamla() {
  const deger = girdi.value;
  const bosluk = deger.lastIndexOf(' ');
  if (bosluk < 0) {
    const adaylar = [...Object.keys(KOMUTLAR), './indir.sh'].filter((n) => n.startsWith(sade(deger)));
    if (adaylar.length === 1) girdi.value = adaylar[0] + ' ';
    else if (adaylar.length > 1) yaz(adaylar.map(kac).join('   '), 'k-soluk');
    return;
  }
  const son = deger.slice(bosluk + 1);
  const kes = son.lastIndexOf('/');
  const r = coz(kes >= 0 ? son.slice(0, kes) || '/' : '');
  if (!r || !r.klasor) return;
  const on = son.slice(kes + 1);
  const adaylar = Object.keys(r.dugum).filter((a) => a.startsWith(on) && (on.startsWith('.') || !a.startsWith('.')));
  if (adaylar.length === 1) {
    const a = adaylar[0];
    girdi.value = deger.slice(0, bosluk + 1) + son.slice(0, kes + 1) + a + (typeof r.dugum[a] === 'object' ? '/' : '');
  } else if (adaylar.length > 1) yaz(adaylar.map(kac).join('   '), 'k-soluk');
}

let gecmisIndeks = 0;
girdi.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') { e.preventDefault(); tamamla(); }
  else if (e.key === 'ArrowUp' && gecmis.length) {
    e.preventDefault();
    gecmisIndeks = Math.max(0, gecmisIndeks - 1);
    girdi.value = gecmis[gecmisIndeks] || '';
  } else if (e.key === 'ArrowDown' && gecmis.length) {
    e.preventDefault();
    gecmisIndeks = Math.min(gecmis.length, gecmisIndeks + 1);
    girdi.value = gecmis[gecmisIndeks] || '';
  } else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); ekran.innerHTML = ''; }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (mesgul) return;
  await acilisiBitir();
  const v = girdi.value;
  girdi.value = '';
  calistir(v);
  gecmisIndeks = gecmis.length;
});

// Hızlı komut şeridi ekrana sığmıyor: dokunulan düğmeyi ortaya kaydır ki komşuları iki yanda görünsün.
const serit = document.getElementById('dokun');
function ortala(dugme) {
  const s = serit.getBoundingClientRect(), d = dugme.getBoundingClientRect();
  serit.scrollBy({ left: d.left + d.width / 2 - (s.left + s.width / 2), behavior: azHareket ? 'auto' : 'smooth' });
}

document.addEventListener('click', (e) => {
  const d = e.target.closest('[data-komut], [data-calistir]');
  if (d?.dataset.calistir) ortala(d);
  if (d) return dokunCalistir(d.dataset.komut || d.dataset.calistir);
  // Ekrana tıklayınca yazma satırına odaklan; ama metin seçen ya da bağlantıya basanı rahatsız etme.
  if (inceImlec && e.target.closest('.pencere') && !e.target.closest('a') && !getSelection().toString()) girdi.focus();
});

// ---------- Açılış: kalkan çizilir, ilk saldırı engellenir ----------
const LOGO = [
  '   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄',
  '   █                     █',
  '   █               ▄█▀   █',
  '   █             ▄█▀     █',
  '   █   ▀█▄     ▄█▀       █',
  '   █     ▀█▄ ▄█▀         █',
  '   ▀█▄     ▀█▀         ▄█▀',
  '     ▀█▄             ▄█▀',
  '       ▀██▄       ▄██▀',
  '          ▀███▄▄███▀',
  '              ▀▀',
];
async function logoCiz() {
  const pre = yaz('', 'ascii');
  pre.setAttribute('aria-hidden', 'true');
  for (const s of LOGO) { pre.textContent += s + '\n'; ekran.scrollTop = ekran.scrollHeight; await bekle(45); }
  yaz(renk('k-mavi k-kalin', '   S İ B E R   K A L K A N'));
}

let acilisSoz = null;
let acilisAtla = false;
async function acilis() {
  let gordu = false;
  try { gordu = sessionStorage.getItem('acilis') === '1'; sessionStorage.setItem('acilis', '1'); } catch { /* gizli sekme: her seferinde göster */ }
  const hiz = (ms) => (acilisAtla || gordu ? Promise.resolve() : bekle(ms));
  if (!gordu) {
    yaz(renk('k-soluk', 'KSOM güvenli kabuk v1.0 — bağlantı şifreleniyor…'));
    await hiz(380);
    yaz(`[ ${renk('k-yesil', ' ok ')} ] kalkan çekirdeği yüklendi`);
    await hiz(260);
    yaz(`[ ${renk('k-yesil', ' ok ')} ] olay kaydı açık`);
    await hiz(420);
    const s = yaz(`[ ${renk('k-kirmizi', 'UYARI')} ] 203.0.113.66 → :22  Gölge Ağ imzalı paket`);
    await hiz(520);
    s.classList.add('carpma');
    yaz(`[ ${renk('k-yesil', ' ok ')} ] paket engellendi. Sistem güvende.`);
    await hiz(300);
  }
  if (acilisAtla || gordu) {
    const pre = yaz(LOGO.join('\n'), 'ascii');
    pre.setAttribute('aria-hidden', 'true');
    yaz(renk('k-mavi k-kalin', '   S İ B E R   K A L K A N'));
  } else await logoCiz();
  yaz('');
  yaz(`Siber güvenliği oynayarak öğreten Türkçe oyun. 6 mini oyun, 48 görev, ${renk('k-kirmizi', 'Gölge Ağ')} seni bekliyor.`);
  yaz(`Terminal bilmiyorsan ${k('rehber')} ile başla, biliyorsan ${k('help')} yaz.`);
  yaz(renk('k-soluk', 'İpucu: aşağıdaki düğmeler komutu senin yerine yazar.'));
}
function acilisiBitir() { acilisAtla = true; return acilisSoz; }

acilisSoz = acilis();
if (inceImlec) girdi.focus({ preventScroll: true });
