// smoke.mjs — verifikasi folder repo persis yang di-deploy ke Cloudflare
// Pages (situs statis: repo root = folder deploy, tanpa build):
// `python3 -m http.server` di port acak, lalu cek / (200 + headline +
// tag og: + link GitHub), /og-image.png (200 + image/*), /favicon.svg
// (200), /styles.css + /app.js (200), /hamdan.png (200 + image/*).
// Hanya GET lokal. Pakai fetch Node (tanpa file temp — tulis file ke
// /tmp tidak bisa diandalkan di VM ini saat EPERM).
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const warnings = [];
const check = (cond, msg) => { if (!cond) failures.push(msg); };
const warn = (msg) => warnings.push(msg);

const PORT = 8396;
const srv = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], {
  cwd: ROOT,
  stdio: 'ignore',
});
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(path) {
  const res = await fetch(`http://127.0.0.1:${PORT}${path}`, { redirect: 'manual' });
  return { status: res.status, type: res.headers.get('content-type') || '', body: await res.text() };
}

try {
  await wait(2500);
  const home = await get('/');
  check(home.status === 200, `/ -> HTTP ${home.status}`);
  for (const tag of ['og:title', 'og:description', 'og:type', 'og:url', 'og:image', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
    check(home.body.includes(tag), `/ tidak mengandung tag ${tag} (og-preview.md)`);
  }
  check(home.body.includes('https://bem-election-campaign.pages.dev/og-image.png'), '/ og:image bukan URL absolut bem-election-campaign.pages.dev/og-image.png');
  check(home.body.includes('Hamdan'), '/ tidak mengandung nama kandidat');
  check(home.body.includes('github.com/dezzorigin/bem-election-campaign'), '/ tidak mengandung tautan GitHub repo');
  check(home.body.includes('hamdan.png'), '/ tidak memakai foto kandidat');
  check(home.body.includes('Simulasi Coblos'), '/ tidak mengandung seksi simulasi');

  const og = await get('/og-image.png');
  if (!existsSync(join(ROOT, 'og-image.png'))) {
    warn('/og-image.png belum ada di disk lokal — dilewati (check-static menegakkan keberadaannya)');
  } else {
    check(og.status === 200, `/og-image.png -> HTTP ${og.status}`);
    check(/^image\//.test(og.type), `/og-image.png -> content-type bukan image/*: ${og.type}`);
  }

  const fav = await get('/favicon.svg');
  check(fav.status === 200, `/favicon.svg -> HTTP ${fav.status}`);

  const css = await get('/styles.css');
  check(css.status === 200, `/styles.css -> HTTP ${css.status}`);

  const js = await get('/app.js');
  check(js.status === 200, `/app.js -> HTTP ${js.status}`);

  const photo = await get('/hamdan.png');
  check(photo.status === 200, `/hamdan.png -> HTTP ${photo.status}`);
  check(/^image\//.test(photo.type), `/hamdan.png -> content-type bukan image/*: ${photo.type}`);
} finally {
  srv.kill();
}

for (const w of warnings) console.log('warn: ' + w);
if (failures.length) {
  console.error(`FAIL smoke: ${failures.length} temuan`);
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log('OK smoke: folder deploy lolos');
