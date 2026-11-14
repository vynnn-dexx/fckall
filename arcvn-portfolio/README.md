# ARCVN MD | Portfolio

Static site: HTML + CSS + vanilla JS. Tanpa build, tanpa dependency, jadi nggak ada yang bisa gagal pas deploy.

## Struktur
- `index.html` : konten utama (teks Tentang ada di sini)
- `css/style.css` : semua style + animasi
- `js/data.js` : **edit ini** buat layanan, project, dan teks marquee
- `js/main.js` : efek (PillNav, SplitText, BlurText, ShinyText, GradientText, DotGrid, ScrollReveal, SpotlightCard, Magnet, ClickSpark)
- `vercel.json` : config Vercel

## Jalanin lokal
Buka `index.html` langsung, atau `npx serve .`

## Deploy ke Vercel
1. Push folder ini ke GitHub (isi file ada di root repo, bukan di dalam subfolder).
2. Vercel > Add New > Project > import repo.
3. Framework Preset: **Other**. Build Command dan Output Directory dikosongin. Deploy.
