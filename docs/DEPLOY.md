# deploy.md — Deploy & Verifikasi Live

## Deploy (Cloudflare Pages, direct-upload API)

Deploy memakai `~/workspace/github-actions/cf_pages.py` (token dari
Secure Vault — jangan minta kredensial, jangan tempel token di chat).

```bash
python3 ~/workspace/github-actions/cf_pages.py create-project bem-election-campaign
python3 ~/workspace/github-actions/cf_pages.py deploy bem-election-campaign ~/workspace/bem-election-campaign
```

- Folder deploy = root repo (situs statis, tanpa build).
- Nama pilihan pertama: `bem-election-campaign`. Fallback bila nama
  dipakai akun lain (sufiks di hasil create): `bem-election`,
  `kampanye-bem`.
- Nama bersufiks di hasil create = dipakai akun lain → pindah ke
  fallback berikutnya.

## Verifikasi live SEBELUM merge

Semua cek memakai python urllib (lihat `docs/testing.md` § "Batas VM
dev" — curl -o tidak bisa dipercaya di VM ini):

1. Root `https://bem-election-campaign.pages.dev/` → 200.
2. Marker ter-render: halaman memuat `Hamdan`, `Simulasi Coblos`,
   `hamdan.png`, dan tautan `github.com/dezzorigin/bem-election-campaign`.
3. Semua tag og:/twitter: ada (`og:title`, `og:description`, `og:type`,
   `og:url`, `og:image`, `twitter:card`, `twitter:title`,
   `twitter:description`, `twitter:image`).
4. `https://bem-election-campaign.pages.dev/og-image.png` → 200 dengan
   content-type `image/*` (bukan `text/html` — fallback Pages menipu).
5. `/hamdan.png`, `/styles.css`, `/app.js`, `/favicon.svg` → 200.

## Menyesuaikan untuk tim kampanye

1. Ganti foto kandidat: timpa `hamdan.png` (rasio 1:1, menghadap kamera).
2. Ganti nama, nomor urut, dan slogan di `index.html` (hero + footer +
   kartu surat suara + `<title>` + tag OG).
3. Ganti 5 program kerja, visi-misi, dan FAQ dengan data resmi.
4. Regenerasi kartu preview: `python3 scripts/make-og-image.py`
   (sesuaikan teks di skrip dengan nama/slogan baru).
5. Deploy ulang dengan perintah di atas.

## Tentang repo & about

Setelah PR merge, set about homepage repo ke URL Pages:

```
PATCH https://api.github.com/repos/dezzorigin/bem-election-campaign
{ "homepage": "https://bem-election-campaign.pages.dev/" }
```
