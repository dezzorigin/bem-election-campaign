# Arsitektur — Bem Election Campaign

Situs statis tanpa build dan tanpa backend. Repo root adalah folder
deploy Cloudflare Pages apa adanya.

## Struktur berkas

```
index.html                  Halaman tunggal: hero, visi-misi, program,
                            tahapan, simulasi coblos, dukung, FAQ, footer
styles.css                  Semua gaya (Archivo + IBM Plex Mono, palet
                            docs/DESIGN.md). Tanpa framework CSS.
app.js                      Menu mobile, simulasi coblos, formulir
                            dukungan (localStorage). Tanpa dependensi.
hamdan.png                  Foto kandidat (aset asli repo).
og-image.png                Kartu preview 1200x630 (PIL, lihat
                            scripts/make-og-image.py).
favicon.svg                 Ikon "01" teal + kuning.
e2e/site.spec.ts            Playwright e2e (desktop 1440 + mobile 390).
playwright.config.ts        Server statis lokal port 4174.
package.json                Hanya devDependencies: @playwright/test,
                            html-validate. Nol dependensi produksi.
scripts/
  check-static.mjs          Gate P0 + OG + kejujuran isi.
  png-size.mjs              Baca dimensi PNG tanpa dependensi.
  smoke.mjs                 Smoke folder deploy (HTTP lokal).
  advisory-sweep.py         Sweep OSV produksi (0 paket).
  make-og-image.py          Generator og-image.png (PIL).
docs/
  DESIGN.md                 Kontrak arah desain (ditulis sebelum coding).
  ARCHITECTURE.md           Berkas ini.
  TESTING.md                Piramida pengujian + batas VM dev.
  DEPLOY.md                 Cara deploy + verifikasi live.
  PRD.md                    PRD produk yang sebenarnya.
  diagrams.html             Diagram arsitektur + alur (HTML+SVG).
  og-preview.md             Spesifikasi kartu preview tautan.
.github/workflows/ci.yml   4 job: static-checks, advisory-sweep,
                            playwright-e2e, smoke.
```

## Aliran data

Tidak ada server, tidak ada basis data, tidak ada pelacak.

- **Simulasi coblos:** klik → `localStorage['bem-campaign-ballot-v1'] =
  'hamdan'` → stempel COBLOS muncul. Tombol ulangi menghapus kunci.
- **Formulir dukungan:** submit → validasi → dorong ke array
  `localStorage['bem-campaign-supporters-v1']` → daftar dirender dari
  array itu. Tombol hapus mengosongkan array. Semua tersimpan di
  perangkat pengunjung; tidak ada yang dikirim ke mana pun.
- **Program kerja & FAQ:** `<details>` native — berfungsi tanpa JS.

## Keputusan yang sengaja dibuat

1. **Tanpa framework.** Satu halaman, tiga berkas. Build step hanya
   menambah titik gagal untuk situs sekecil ini.
2. **Tanpa tanggal pemilihan.** Repo asli tidak memuat tanggal resmi;
   halaman menulis "tanggal resmi diumumkan panitia pemilihan" daripada
   mengarang tanggal.
3. **Konten program = contoh.** Repo asli tidak memuat program resmi;
   halaman dan README menyatakan ini jujur. Tim kampanye mengganti
   isinya (lihat `docs/deploy.md` § "Menyesuaikan untuk tim kampanye").
4. **Foto dipakai apa adanya.** `hamdan.png` adalah satu-satunya aset
   foto di repo; tidak ada foto lain yang diunduh atau dikarang.

## Batas yang diketahui

- Dukungan dan hasil simulasi hanya ada di perangkat masing-masing
  pengunjung (localStorage) — tidak ada rekap pusat.
- Font Google (Archivo, IBM Plex Mono) dimuat dari CDN Google Fonts;
  tanpa internet, halaman jatuh ke system-ui/monospace dan tetap
  terbaca.
