# Şükür365 – Tek Sayfalık Tanıtım Sitesi

Bu klasör, Şükür365 uygulaması için tek sayfalık tanıtım (landing) sitesini içerir.

## İçerik

- **index.html** – Ana sayfa (hero, özellikler, nasıl çalışır, indir, footer)
- **styles.css** – Uygulama renk paletine uyumlu (yeşil/altın) stiller, responsive
- **script.js** – Mobil menü aç/kapa, ESC ile kapatma
- **favicon.ico** – Site ikonu (proje `assets` klasöründen kopyalandı)

## Yerel Önizleme

Proje kökünden:

```bash
npx serve web
```

Veya doğrudan `index.html` dosyasını tarayıcıda açabilirsiniz.

## Yayınlama

- **Netlify / Vercel:** `web` klasörünü site kökü olarak seçin.
- **GitHub Pages:** `web` içeriğini `gh-pages` branch’ine veya `docs/` klasörüne koyun; kök olarak `web` (veya `docs`) ayarlayın.

Footer’daki “Gizlilik” ve “Kullanım Koşulları” linkleri şu an `#gizlilik` ve `#kullanim` (placeholder). Gerekirse proje kökündeki `PRIVACY_POLICY.md` ve `TERMS_OF_SERVICE.md` dosyalarınızın yayınlandığı URL’lerle değiştirebilirsiniz.
