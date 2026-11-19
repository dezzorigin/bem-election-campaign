# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Rebuild total landing kampanye: hero kandidat, visi & misi, 5 program
  kerja (bisa dibuka), 4 tahapan pemilihan, simulasi coblos interaktif,
  formulir dukungan (localStorage), FAQ, footer.
- `styles.css` + `app.js` (situs statis, tanpa framework, tanpa build).
- Kartu preview tautan: semua tag og:/twitter: + `og-image.png`
  1200x630 (PIL, `scripts/make-og-image.py`).
- CI 4 job (`.github/workflows/ci.yml`): html-validate + gate P0,
  advisory-sweep OSV, Playwright e2e (desktop + mobile), smoke.
- Docs: DESIGN (kontrak arah desain), ARCHITECTURE, TESTING, DEPLOY,
  og-preview, diagrams.html (HTML+SVG), PRD rewrite.
- README standar + PRD v2.0 yang menggambarkan produk sebenarnya.

### Changed
- `index.html` ditulis ulang penuh — sebelumnya isinya salinan
  `prompt.md` (komponen React smooth-scroll), bukan HTML.
- PRD v1.0 (generik, tidak menggambarkan produk) diganti PRD v2.0.
- `.gitignore` dibersihkan (duplikat dihapus, pola env disatukan).

### Removed
- Klaim lama di CHANGELOG (setup Next.js, voting real-time, admin
  panel, Supabase) — tidak pernah ada di repo; dihapus karena tidak
  benar. Riwayat jujur repo: landing statis + foto kandidat.

## [1.0.0] - 2024-11-05

### Added
- Scaffold awal repo: README, LICENSE, PRD generik, `hamdan.png`,
  `prompt.md`, `index.html` (salinan prompt, bukan halaman).
