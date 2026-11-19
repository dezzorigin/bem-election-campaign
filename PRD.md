# PRD — Bem Election Campaign

## 1. Informasi Proyek

| Field | Nilai |
|---|---|
| Nama Proyek | Bem Election Campaign |
| Tech Stack | HTML/CSS/JavaScript (situs statis, tanpa build, tanpa backend) |
| Status | Proper — live di Cloudflare Pages |
| Penanggung Jawab | Nabil Aulia Dika |
| Versi Dokumen | 2.0 (rewrite 19 Nov 2026 — menggantikan PRD generik v1.0) |
| Tanggal | 2026-11-19 |

## 2. Latar Belakang

Repo ini awalnya hanya berisi foto kandidat (`hamdan.png`), sebuah
`index.html` yang isinya ternyata salinan `prompt.md` (komponen React
smooth-scroll, bukan HTML), PRD generik, dan README 747 karakter. Tidak
ada nama lengkap, fakultas, tanggal pemilihan, atau program kerja resmi
di repo mana pun. PRD v1.0 tidak menggambarkan produk yang sebenarnya.

PRD ini ditulis ulang dari isi repo yang benar-benar ada: landing
kampanye pemilihan Ketua BEM untuk satu kandidat (Hamdan, nomor urut
01) dengan foto asli dari repo.

## 3. Masalah yang Diselesaikan

- Mahasiswa butuh satu halaman yang mengenalkan kandidat, visi-misi,
  dan program kerja tanpa harus bertanya satu-satu ke tim kampanye.
- Pemilih pertama butuh latihan mencoblos sebelum hari pemilihan.
- Tim kampanye butuh template landing yang bisa dipakai ulang: ganti
  foto, nama, dan program, lalu deploy ulang.

## 4. Tujuan & Sasaran

- Satu halaman yang memuat: hero kandidat, visi & misi, 5 program
  kerja, 4 tahapan pemilihan, simulasi coblos, formulir dukungan, FAQ.
- Semua tombol, tautan, dan formulir berfungsi (tanpa backend —
  state di localStorage perangkat pengunjung).
- Jujur soal isi: program kerja dan slogan adalah contoh template
  yang wajib diganti tim kampanye dengan data resmi; simulasi coblos
  ditegaskan bukan suara resmi; tidak ada tanggal pemilihan palsu.

## 5. Ruang Lingkup

### In Scope
- Landing statis: hero, visi-misi, program kerja (5 item, bisa dibuka),
  tahapan (4 langkah), simulasi coblos, formulir dukungan, FAQ, footer.
- Foto kandidat `hamdan.png` (aset asli repo).
- Kartu preview tautan (OG/Twitter + `og-image.png` 1200x630).
- CI: html-validate, gate P0, OSV advisory sweep, Playwright e2e,
  smoke folder deploy.
- Docs: DESIGN, ARCHITECTURE, TESTING, DEPLOY, og-preview, diagram.

### Out of Scope
- Pemungutan suara resmi (simulasi di situs ini bukan suara resmi).
- Backend, basis data, atau rekap dukungan pusat.
- Donasi atau pendaftaran relawan resmi (formulir hanya demo lokal).
- Integrasi pihak ketiga.

## 6. Fitur & Persyaratan Fungsional

| # | Fitur | Perilaku |
|---|---|---|
| 1 | Hero kandidat | Nama, nomor urut 01, slogan, foto dalam bingkai arch, CTA ke simulasi + program |
| 2 | Visi & misi | Pernyataan visi + 3 misi |
| 3 | Program kerja | 5 item bernomor, tiap item bisa dibuka untuk melihat cara kerja |
| 4 | Tahapan pemilihan | 4 langkah dari kenali calon sampai bilik suara |
| 5 | Simulasi coblos | Klik kartu surat suara → stempel COBLOS muncul; sekali saja; tombol ulangi mereset; tersimpan di localStorage |
| 6 | Formulir dukungan | Nama + prodi wajib (validasi), pesan opsional maks 280 karakter, pilihan peran; tersimpan di localStorage, daftar dirender, bisa dihapus |
| 7 | FAQ | 4 pertanyaan, `<details>` native |
| 8 | Navigasi | Sticky navbar + menu mobile, tautan GitHub kanan atas ke repo |
| 9 | Kartu preview | Semua tag og:/twitter: + `og-image.png` 1200x630 |

## 7. Persyaratan Non-Fungsional

- **Performa:** situs statis, tanpa build; satu-satunya dependensi
  eksternal adalah Google Fonts (jatuh ke system font bila offline).
- **Keamanan:** rahasia (`.env`) tidak boleh ter-commit; situs tidak
  mengirim data apa pun ke server (semua state localStorage).
- **Aksesibilitas:** kontras AA, focus-visible, `aria-pressed` pada
  kartu coblos, `role="status"` pada pesan formulir, target sentuh
  min 44px, `prefers-reduced-motion` dihormati.
- **Responsif:** mobile 390px tanpa scroll horizontal.
- **Maintainability:** kode terstruktur, terdokumentasi (lihat
  `docs/ARCHITECTURE.md`).

## 8. Arsitektur & Tech Stack

HTML/CSS/JavaScript murni, tanpa framework, tanpa build. Lihat
`docs/ARCHITECTURE.md` dan `docs/diagrams.html`.

## 9. Milestone / Roadmap

| Fase | Status |
|---|---|
| Inisialisasi & scaffolding | ✅ (repo awal) |
| Rebuild total (landing + interaksi + CI + docs) | ✅ 19 Nov 2026 |
| Testing & QA (CI 4 job) | ✅ |
| Deployment (Cloudflare Pages) | ✅ |
| Dokumentasi | ✅ |
| Screenshot README + video demo | ⏳ follow-up (butuh browser live / VM pulih) |

## 10. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Isi contoh dikira data resmi | Label "Konten contoh" di hero + footer + README + FAQ |
| Simulasi dikira suara resmi | Penegasan di kartu, status, FAQ, dan PRD ini |
| Konfigurasi env bocor | `.gitignore` + gate check-static |
| Dependency usang | Audit berkala via OSV sweep di CI |

## 11. Kriteria Keberhasilan

- Situs berjalan tanpa error; semua tombol/tautan/formulir berfungsi
  (dibuktikan e2e Playwright di CI).
- Live di Cloudflare Pages; root 200 + tag OG lengkap + og-image 200
  image/*.
- README & PRD lengkap dan up-to-date.
- Tidak ada secret yang ter-commit.

## 12. Lampiran

- Struktur: lihat README.md
- Desain: docs/DESIGN.md (referensi: Framer Politica)
- Lisensi: MIT (LICENSE)
