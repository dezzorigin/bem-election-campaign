# testing.md — Pengujian

## Piramida pengujian

| Lapisan | Alat | Perintah |
|---|---|---|
| Validasi HTML | html-validate 11 (Node ≥ 22) | `npx html-validate index.html` |
| Gate P0 + OG + kejujuran isi | `scripts/check-static.mjs` | `npm run validate` |
| Advisory (produksi) | OSV batch `scripts/advisory-sweep.py` | `python3 scripts/advisory-sweep.py` |
| E2E desktop + mobile | Playwright | `npx playwright test` |
| Smoke folder deploy | `scripts/smoke.mjs` | `npm run smoke` |

Semua lapisan di atas berjalan di CI (`.github/workflows/ci.yml`, 4 job)
pada tiap push dan PR ke `main`.

## Cakupan e2e (`e2e/site.spec.ts`)

1. Hero + OG + tautan GitHub (semua tag og:/twitter: terisi, og:image
   = URL absolut pages.dev).
2. Program kerja: 5 item, `<details>` pertama tertutup lalu terbuka
   saat diklik.
3. Tahapan: 4 langkah, langkah ke-4 menyebut bilik suara.
4. Simulasi coblos: klik sekali → `aria-pressed=true`, stempel muncul,
   status "Tercoblos"; klik kedua tidak mengubah; tombol ulangi mereset.
5. Formulir dukungan: submit kosong → dua pesan galat; isi lengkap →
   tercatat, penghitung 0→1, bertahan setelah reload (localStorage);
   tombol hapus mengosongkan.
6. Berkas: `/og-image.png`, `/hamdan.png`, `/styles.css`, `/app.js`
   semua 200 (og-image + foto dengan content-type image/*).
7. Mobile 390px: tanpa scroll horizontal; menu mobile bisa dibuka.

## Menjalankan lokal

```bash
npx html-validate index.html
npm run validate          # check-static
python3 scripts/advisory-sweep.py
npm run serve             # http://127.0.0.1:8395 (terminal lain)
npx playwright test       # butuh PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
npm run smoke
```

## Batas VM dev (temuan 19 Nov 2026, BUKAN intermiten)

VM dev hasil penggantian ~04:30 WIB 19 Nov 2026 memberlakukan aturan
sandbox yang deterministik — jangan buang waktu mengulang perintah yang
sudah terbukti gagal di pola yang sama:

1. **Tulis file sesudah I/O jaringan = EPERM.** Dalam satu sesi `exec`,
   begitu ada proses yang melakukan I/O jaringan, SEMUA tulis file
   berikutnya di sesi itu gagal `EPERM: operation not permitted, write`.
   Karena itu file hanya ditulis lewat perkakas tulis (muse.write) atau
   proses yang sama sekali tidak menyentuh jaringan.
2. **npm install / npm ci lokal GAGAL deterministik** — jangan install
   lokal, andalkan CI. Untuk validasi lokal, symlink `node_modules`
   dari repo P1 lain yang sudah punya paket yang sama sudah cukup
   (lihat bawah).
3. **Chrome/Chromium lokal TIDAK BISA start** (mmap MAP_SHARED memfd
   ditolak EPERM → SIGTRAP). Screenshot lokal, video demo lokal, e2e
   lokal, dan play-test headless lokal TIDAK BISA. E2E Playwright
   hanya di CI.
4. **Cek live pakai python urllib** (curl -o menulis file 0 byte walau
   melapor size N; pipe curl|grep tidak bisa dipercaya; status-only
   curl -o /dev/null -w %{http_code} masih bisa).
5. **Screenshot README + video demo = FOLLOW-UP** (browser live / saat
   VM pulih), BUKAN gate merge.

### Validasi lokal tanpa npm install

```bash
ln -s ~/workspace/report-fraud/node_modules node_modules
./node_modules/.bin/html-validate index.html
node scripts/check-static.mjs
python3 scripts/advisory-sweep.py
node scripts/smoke.mjs
```
