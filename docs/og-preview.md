# og-preview.md — Kartu Preview Tautan

## Yang diwajibkan

`index.html` memuat SEMUA tag berikut (ditegakkan `scripts/check-static.mjs`
dan `scripts/smoke.mjs`):

- `og:title` — "Hamdan — Calon Ketua BEM · Nomor Urut 01"
- `og:description` — "Visi-misi, program kerja, tahapan pemilihan, dan simulasi coblos. BEM yang kerja, bukan sekadar janji."
- `og:type` — "website"
- `og:url` — "https://bem-election-campaign.pages.dev/"
- `og:image` — "https://bem-election-campaign.pages.dev/og-image.png" (URL absolut)
- `twitter:card` — "summary_large_image"
- `twitter:title`, `twitter:description`, `twitter:image` — sama dengan padanan og:

## Gambar preview

- Berkas: `og-image.png`, 1200x630, PNG, ~43 KB.
- Dibuat dengan PIL (`scripts/make-og-image.py`) mengikuti palet situs
  (kertas `#FDFBF3`, teal `#0E7C7B`, merah `#C1121F`, kuning `#FFD60A`):
  lencana nomor "01", nama "Hamdan", slogan dengan sorotan kuning,
  tiga chip (5 program kerja, simulasi coblos, visi & misi), stempel
  bundar "COBLOS", dan URL situs di bawah.
- **Ini kartu desain, bukan screenshot asli** — tidak diklaim sebagai
  tangkapan layar halaman. Screenshot asli halaman adalah follow-up
  (lihat README § "Follow-up").
- Regenerasi: `python3 scripts/make-og-image.py` (lokal, tanpa jaringan).
