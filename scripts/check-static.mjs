// check-static.mjs — gate anti-slop P0 + link preview + kejujuran isi,
// dipakai `npm run validate` dan job `static-checks` di CI:
//   1. Tanpa gradient ungu/biru, tanpa headline gradient, tanpa font Inter /
//      Roboto, tanpa rounded-2xl/3xl + shadow-lg/2xl di UI, tanpa emoji
//      mentah sebagai ikon fungsi, tanpa statistik vanity palsu.
//   2. Tanpa file .env yang ter-commit; tanpa secret kasar.
//   3. Link preview (docs/og-preview.md): index.html wajib memuat SEMUA
//      tag og:/twitter: dan og-image.png wajib ada (1200x630, PIL).
//   4. Kejujuran: halaman wajib menyatakan konten contoh + simulasi bukan
//      suara resmi; tanpa tanggal pemilihan palsu.
// Keluar 1 bila ada satu saja temuan.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from './png-size.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const fail = (msg) => failures.push(msg);

const SRC_FILES = [];
const walk = (dir) => {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (!['node_modules', '.git', 'docs'].includes(e.name)) walk(p);
    } else if (/\.(mjs|js|json|html|css)$/.test(e.name) && !e.name.endsWith('.lock')) {
      SRC_FILES.push(p);
    }
  }
};
walk(ROOT);
SRC_FILES.push(join(ROOT, 'package.json'));
SRC_FILES.push(join(ROOT, 'index.html'));
// Checker dikecualikan dari scan sendiri: pola-pola P0 di file ini adalah
// data aturan, bukan UI.
const CHECKER = join(ROOT, 'scripts', 'check-static.mjs');
const SCANNED = SRC_FILES.filter((f) => f !== CHECKER);

const P0_CHECKS = [
  [/linear-gradient\([^)]*(violet|purple|indigo|blue|#6366f1|#818cf8|#7d2ae8|#00c4cc)/i, 'gradient ungu/biru'],
  [/bg-clip-text/, 'headline gradient (bg-clip-text)'],
  [/\bfont-family:[^;]*\bInter\b/, 'font Inter'],
  [/\bfont-family:[^;]*\bRoboto\b/, 'font Roboto'],
  [/rounded-2xl|rounded-3xl|rounded-4xl/, 'rounded-2xl/3xl/4xl (radius template)'],
  [/shadow-lg|shadow-2xl/, 'shadow-lg/2xl di permukaan'],
  [/from-(violet|purple|indigo|blue|fuchsia|rose|sky|emerald|teal)-\d+/, 'gradient Tailwind (from-…-…)'],
  [/bg-linear-to-(br|tr|tl|r|b)/, 'gradient linear Tailwind (bg-linear-to-…)'],
  [/maximumScale:\s*1/, 'viewport maximumScale: 1 (melarang zoom)'],
];

for (const f of SCANNED) {
  const raw = readFileSync(f, 'utf-8');
  // Strip komentar (blok + baris penuh) sebelum cek: komentar boleh
  // MENYEBUT pola sebagai dokumentasi, bukan menampilkannya.
  const src = raw
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .filter((l) => !l.trim().startsWith('//'))
    .join('\n');
  for (const [re, label] of P0_CHECKS) {
    if (re.test(src)) fail(`${f.replace(ROOT + '/', '')}: ${label}`);
  }
  // Emoji mentah sebagai ikon fungsi (bukan di komentar/dok).
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(src)) {
    fail(`${f.replace(ROOT + '/', '')}: emoji mentah di kode UI`);
  }
  // Statistik vanity palsu.
  if (/\d{2,}k\+ users|\d+% uptime|10x faster|50k\+/i.test(src)) {
    fail(`${f.replace(ROOT + '/', '')}: statistik vanity tanpa sumber`);
  }
}

// Secret kasar di file yang ter-commit.
for (const f of SCANNED) {
  const src = readFileSync(f, 'utf-8');
  if (/(api[_-]?key|secret|password)\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}['"]/i.test(src)) {
    fail(`${f.replace(ROOT + '/', '')}: kemungkinan secret ter-commit`);
  }
}
if (existsSync(join(ROOT, '.env'))) fail('.env ter-commit');

// Link preview: semua tag og:/twitter: wajib ada di index.html.
const html = readFileSync(join(ROOT, 'index.html'), 'utf-8');
for (const tag of ['og:title', 'og:description', 'og:type', 'og:url', 'og:image', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
  if (!html.includes(tag)) fail(`index.html tidak mengandung tag ${tag}`);
}
if (!html.includes('https://bem-election-campaign.pages.dev/og-image.png')) {
  fail('og:image bukan URL absolut bem-election-campaign.pages.dev/og-image.png');
}
if (!html.includes('https://github.com/dezzorigin/bem-election-campaign')) {
  fail('index.html tidak mengandung tautan GitHub repo');
}
if (!html.includes('hamdan.png')) fail('index.html tidak memakai foto kandidat hamdan.png');

// og-image.png wajib ada, 1200x630, minimal 10 KB.
const ogPath = join(ROOT, 'og-image.png');
if (!existsSync(ogPath)) {
  fail('og-image.png tidak ada');
} else {
  const { width, height, size } = PNG.read(ogPath);
  if (width !== 1200 || height !== 630) fail(`og-image.png ${width}x${height}, harus 1200x630`);
  if (size < 10 * 1024) fail(`og-image.png ${size} byte, di bawah minimal 10 KB`);
}

// Kejujuran isi: label contoh + simulasi bukan suara resmi wajib ada
// (normalisasi whitespace: frasa boleh terbelah baris di HTML).
const flat = html.replace(/\s+/g, ' ');
if (!flat.includes('Konten contoh')) fail('index.html tidak menyatakan konten contoh');
if (!flat.includes('bukan suara resmi')) fail('index.html tidak menegaskan simulasi bukan suara resmi');

if (failures.length) {
  console.error(`FAIL check-static: ${failures.length} temuan`);
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log('OK check-static: P0 + OG + kejujuran isi lolos');
