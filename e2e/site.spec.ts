import { test, expect } from '@playwright/test';

test.describe('Bem Election Campaign — landing kampanye BEM', () => {
  test('hero + OG + tautan GitHub', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Hamdan');
    await expect(page.locator('.hero-slogan')).toContainText('BEM yang');
    await expect(page.locator('.hero-photo img')).toHaveAttribute('src', 'hamdan.png');
    // Meta OG/Twitter lengkap (docs/og-preview.md).
    for (const prop of ['og:title', 'og:description', 'og:type', 'og:url', 'og:image']) {
      const content = await page.locator(`meta[property="${prop}"]`).getAttribute('content');
      expect(content, `meta ${prop} kosong`).toBeTruthy();
    }
    expect(await page.locator('meta[property="og:image"]').getAttribute('content'))
      .toBe('https://bem-election.pages.dev/og-image.png');
    for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
      const content = await page.locator(`meta[name="${name}"]`).getAttribute('content');
      expect(content, `meta ${name} kosong`).toBeTruthy();
    }
    await expect(page.locator('.site-nav .gh-link')).toHaveAttribute('href', 'https://github.com/dezzorigin/bem-election-campaign');
  });

  test('program kerja: 5 item, detail bisa dibuka', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.program-item')).toHaveCount(5);
    await expect(page.locator('.program-item').first()).toContainText('Advokasi');
    const first = page.locator('.program-item details').first();
    await expect(first).not.toHaveAttribute('open', '');
    await page.locator('.program-item summary').first().click();
    await expect(first).toHaveAttribute('open', '');
    await expect(first.locator('.program-body')).toContainText('aspirasi');
  });

  test('tahapan: 4 langkah', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.step')).toHaveCount(4);
    await expect(page.locator('.step').nth(2)).toContainText('bilik suara');
    await expect(page.locator('.step').nth(3)).toContainText('hari pemilihan');
  });

  test('simulasi coblos: klik sekali, stempel muncul, ulangi mereset', async ({ page }) => {
    await page.goto('/');
    const row = page.locator('#ballot-row');
    await expect(row).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('#ballot-status')).toContainText('Belum dicoblos');
    await row.click();
    await expect(row).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#ballot-status')).toContainText('Tercoblos');
    await expect(page.locator('#ballot-reset')).toBeVisible();
    // Klik kedua tidak mengubah (sekali, seperti surat suara asli).
    await row.click();
    await expect(row).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#ballot-reset').click();
    await expect(row).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('#ballot-status')).toContainText('Belum dicoblos');
  });

  test('formulir dukungan: validasi + tersimpan lokal', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#supporter-count')).toContainText('0');
    await page.locator('#support-form button[type="submit"]').click();
    await expect(page.locator('#err-nama')).toBeVisible();
    await expect(page.locator('#err-prodi')).toBeVisible();
    await page.fill('#f-nama', 'Uji Coba');
    await page.fill('#f-prodi', 'Informatika');
    await page.fill('#f-pesan', 'Perbaiki ruang belajar, ya.');
    await page.locator('#support-form button[type="submit"]').click();
    await expect(page.locator('#form-status')).toContainText('tercatat');
    await expect(page.locator('#supporter-count')).toContainText('1');
    await expect(page.locator('#supporters-list')).toContainText('Uji Coba');
    await expect(page.locator('#supporters-list')).toContainText('Perbaiki ruang belajar');
    // Bertahan setelah reload (localStorage).
    await page.reload();
    await expect(page.locator('#supporter-count')).toContainText('1');
    await expect(page.locator('#supporters-list')).toContainText('Uji Coba');
    // Hapus semua dukungan lokal.
    await page.locator('#supporters-clear').click();
    await expect(page.locator('#supporter-count')).toContainText('0');
  });

  test('berkas: og-image 200 image/*, foto 200', async ({ page, request }) => {
    await page.goto('/');
    const og = await request.get('/og-image.png');
    expect(og.status()).toBe(200);
    expect(og.headers()['content-type'] || '').toMatch(/^image\//);
    const photo = await request.get('/hamdan.png');
    expect(photo.status()).toBe(200);
    expect(photo.headers()['content-type'] || '').toMatch(/^image\//);
    const css = await request.get('/styles.css');
    expect(css.status()).toBe(200);
    const js = await request.get('/app.js');
    expect(js.status()).toBe(200);
  });

  test('mobile: tanpa scroll horizontal', async ({ page }, testInfo) => {
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBe(0);
    // Tombol menu hanya tampil di viewport mobile (CSS max-width 640px);
    // di proyek desktop tombolnya display:none dan tidak bisa diklik.
    if (testInfo.project.name === 'mobile') {
      await page.locator('.nav-toggle').click();
      await expect(page.locator('.site-nav')).toHaveClass(/open/);
    }
  });
});
