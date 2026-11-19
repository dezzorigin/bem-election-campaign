# DESIGN.md — Kontrak Arah Desain Bem Election Campaign

> Ditulis SEBELUM coding (standar anti-slop P1). Referensi dulu, baru bangun.
> Produk: landing kampanye pemilihan Ketua BEM — satu kandidat (Hamdan,
> foto `hamdan.png` dari repo asli), nomor urut 01. Fungsinya: mengenalkan
> kandidat + visi-misi + program kerja, menjelaskan tahapan pemilihan,
> simulasi coblos interaktif, dan formulir dukungan (tersimpan lokal).
> Semua interaksi jalan di browser tanpa backend.

## Kejujuran isi (penting)

Repo asli hanya berisi: foto kandidat (`hamdan.png`), `index.html` yang
isinya ternyata salinan `prompt.md` (komponen React smooth-scroll, bukan
HTML), PRD generik, dan README 747 karakter. Tidak ada nama lengkap,
fakultas, tanggal pemilihan, atau program kerja resmi di repo mana pun.

Karena itu isi halaman ini adalah **konten contoh template kampanye** —
nama "Hamdan", nomor urut "01", slogan, visi-misi, dan 5 program kerja
adalah placeholder yang wajib diganti tim kampanye dengan data resmi
sebelum dipakai sungguhan. Hal ini dinyatakan jujur di README dan di
footer situs ("Konten contoh — ganti dengan data resmi tim kampanye").
Tidak ada statistik vanity, tidak ada tanggal pemilihan palsu: tahapan
menyebut tanggal resmi diumumkan panitia pemilihan.

## Referensi

**Pemenang: Politica — Politician, Election Campaign Framer Template**
https://poolitica.framer.website/

Kenapa menang: struktur halaman kampanye yang terbukti jalan — hero
nama besar + CTA, lalu daftar isu bernomor (01–05) dengan judul +
deskripsi, lalu misi/visi, lalu agenda kegiatan, lalu ajakan gabung
(relawan). Strukturnya yang di-clone: urutan narasi (nama → program
bernomor → tahapan → ajakan bertindak) dan daftar program bernomor
vertikal sebagai tulang punggung halaman.
Yang diubah: bahasa Indonesia, konteks BEM/mahasiswa (bukan politik
nasional), palet dari warna jaket almamater di foto kandidat (bukan
biru/merah generik template), tipografi grotesk + mono, dan "produk"
interaktifnya adalah simulasi surat suara — bukan formulir donasi.

Kandidat yang kalah:

- **CivicRise — Framer template kampanye (gratis)**
  https://www.framer.com/marketplace/templates/civicrise/
  Kalah: hero + CTA generik tanpa struktur program bernomor; yang
  dipinjam hanya gagasan strip dukungan di bawah hero.
- **People's Platform — Block & Bold (designmd.app)**
  https://designmd.app/library/peoples-platform
  Kalah: energi poster protes (Alfa Slab + tulisan tangan) terlalu
  kasar untuk situs kampanye kampus yang harus dibaca orang tua,
  dosen, dan panitia; yang dipinjam hanya prinsip "nama paling besar,
  satu slogan, satu aksi".

## Palet (6 warna bernama, tiap warna punya tugas)

Warna utama diambil dari foto kandidat: jaket almamater teal.

| Nama | Hex | Peran |
|---|---|---|
| Kertas Suara | `#FDFBF3` | Latar utama semua halaman (kertas hangat, bukan krem template) |
| Teal Almamater | `#0E7C7B` | Warna primer: navbar bawah, panel visi, nomor program (dari jaket di `hamdan.png`) |
| Tinta Sidang | `#14201E` | Teks utama, headline, border tebal |
| Merah Coblos | `#C1121F` | CTA utama, stempel COBLOS, nomor urut (merah suara, bukan merah marah) |
| Kuning Sorot | `#FFD60A` | Sorotan marker di bawah slogan + centang surat suara |
| Abu Panitia | `#5C6B66` | Teks sekunder, label, metadata |

Bukan satu hue: teal dingin + merah + kuning di atas kertas hangat.
Tanpa gradient apa pun; tanpa ungu/biru gradient. Mode terang saja —
ini poster kampanye, bukan aplikasi malam.

## Tipografi (maks 2 keluarga)

- **Archivo** — display/headline (900, lebar diperluas) + body (400/600).
  Rasa poster kampus: tebal, rapat, terbaca dari seberang lorong.
- **IBM Plex Mono** — label, nomor urut, kicker, metadata (tabular-nums).
  Rasa dokumen panitia: nomor surat suara, tahapan, cap.

## Layout (satu kalimat)

Poster kampanye asimetris: kolom kiri nama raksasa + slogan + satu CTA
merah, kolom kanan foto kandidat dalam bingkai lengkung (arch) di atas
lencana nomor urut; di bawahnya program kerja sebagai daftar bernomor
vertikal, bukan grid kartu.

## Detail khas (signature detail)

**Kartu Surat Suara interaktif** — simulasi coblos: baris kandidat
dengan kotak centang kuning, sekali klik muncul stempel bundar
"COBLOS" merah miring + perforasi di tepi kartu (lubang-lubang
setengah lingkaran), lengkap dengan tombol "Ulangi simulasi".
Ditegaskan di kartu: ini simulasi, bukan pemungutan suara resmi.

## Radius & spacing

- Sudut tajam 2px di hampir semua permukaan (poster, bukan kartu SaaS).
- Satu pengecualian: bingkai foto arch (lengkung penuh di atas) —
  satu-satunya lengkung besar di halaman, supaya foto jadi penanda.
- Grid 4/8pt; padding kartu ≥ 16px; border 2px tinta di permukaan
  penting (bukan bayangan lembut).

## Beda dari repo sebelumnya (#39 report-fraud)

Minimal 3 dari 5 sumbu, tercapai 5/5:

| Sumbu | #39 report-fraud | Repo ini (#40) |
|---|---|---|
| Palet | slate gelap `#14232E` + emas + serif arsip | kertas terang + teal almamater + merah coblos + kuning sorot |
| Tipografi | Newsreader serif + Archivo | Archivo grotesk lebar + IBM Plex Mono |
| Layout | editorial terpusat, kartu temuan | hero asimetris 2 kolom + daftar program bernomor vertikal |
| Radius/spacing | rounded 8px, bayangan lembut | sudut tajam 2px + satu arch foto, border tebal 2px |
| Detail khas | segel bundar + label arsip | kartu surat suara + stempel COBLOS + perforasi |

## Larangan P0 yang dicek (`scripts/check-static.mjs`)

Tanpa gradient ungu/biru, tanpa headline gradient, tanpa Inter/Roboto,
tanpa `rounded-2xl/3xl`, tanpa `shadow-lg/2xl`, tanpa emoji mentah
sebagai ikon fungsi (ikon = SVG stroke 1.5–2px), tanpa statistik
vanity, tanpa copy generik ("Elevate your workflow"), tanpa footer
4 kolom default.
