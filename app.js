// Bem Election Campaign — interaksi halaman (tanpa backend):
// menu mobile, simulasi coblos (localStorage), formulir dukungan
// (localStorage), penghitung karakter pesan, tahun footer.
(function () {
  'use strict';

  var $ = function (sel) { return document.querySelector(sel); };

  // Tahun footer.
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ── Menu mobile ──────────────────────────────────────────
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav-menu');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Simulasi coblos ──────────────────────────────────────
  var KEY_BALLOT = 'bem-campaign-ballot-v1';
  var row = $('#ballot-row');
  var status = $('#ballot-status');
  var resetBtn = $('#ballot-reset');
  var stamp = $('#ballot-stamp');

  function paintBallot(voted) {
    if (!row) return;
    row.setAttribute('aria-pressed', voted ? 'true' : 'false');
    if (stamp) stamp.setAttribute('aria-hidden', voted ? 'false' : 'true');
    if (status) {
      status.textContent = voted
        ? 'Tercoblos: 01 · Hamdan. Ini simulasi — bukan suara resmi.'
        : 'Belum dicoblos — klik kotak untuk mencoblos.';
    }
    if (resetBtn) resetBtn.hidden = !voted;
  }

  var voted = false;
  try { voted = localStorage.getItem(KEY_BALLOT) === 'hamdan'; } catch (e) { voted = false; }
  paintBallot(voted);

  if (row) {
    row.addEventListener('click', function () {
      if (row.getAttribute('aria-pressed') === 'true') return; // sekali, seperti surat suara asli
      try { localStorage.setItem(KEY_BALLOT, 'hamdan'); } catch (e) { /* mode privat: tetap tampil */ }
      paintBallot(true);
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      try { localStorage.removeItem(KEY_BALLOT); } catch (e) { /* abaikan */ }
      paintBallot(false);
      row.focus();
    });
  }

  // ── Formulir dukungan (localStorage) ─────────────────────
  var KEY_SUPPORTERS = 'bem-campaign-supporters-v1';
  var form = $('#support-form');
  var list = $('#supporters-list');
  var countEl = $('#supporter-count');
  var clearBtn = $('#supporters-clear');
  var formStatus = $('#form-status');
  var pesan = $('#f-pesan');
  var pesanCount = $('#pesan-count');

  function loadSupporters() {
    try {
      var raw = localStorage.getItem(KEY_SUPPORTERS);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }
  function saveSupporters(arr) {
    try { localStorage.setItem(KEY_SUPPORTERS, JSON.stringify(arr)); } catch (e) { /* abaikan */ }
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function renderSupporters() {
    var arr = loadSupporters();
    if (countEl) countEl.textContent = String(arr.length);
    if (clearBtn) clearBtn.hidden = arr.length === 0;
    if (!list) return;
    if (arr.length === 0) {
      list.innerHTML = '<li class="supporters-empty">Belum ada dukungan. Jadilah yang pertama lewat formulir di atas.</li>';
      return;
    }
    list.innerHTML = arr.map(function (s) {
      var msg = s.pesan ? '<p class="s-msg">' + esc(s.pesan) + '</p>' : '';
      return '<li><span class="s-name">' + esc(s.nama) + '</span>' +
        '<span class="s-meta">' + esc(s.prodi) + ' · ' + esc(s.peran) + '</span>' + msg + '</li>';
    }).join('');
  }

  if (pesan && pesanCount) {
    pesan.addEventListener('input', function () {
      pesanCount.textContent = String(pesan.value.length);
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nama = $('#f-nama');
      var prodi = $('#f-prodi');
      var errNama = $('#err-nama');
      var errProdi = $('#err-prodi');
      var ok = true;
      if (!nama.value.trim() || nama.value.trim().length < 2) { errNama.hidden = false; ok = false; } else { errNama.hidden = true; }
      if (!prodi.value.trim() || prodi.value.trim().length < 2) { errProdi.hidden = false; ok = false; } else { errProdi.hidden = true; }
      if (!ok) {
        if (formStatus) { formStatus.textContent = 'Periksa lagi isian yang ditandai.'; formStatus.classList.remove('ok'); }
        (errNama.hidden ? prodi : nama).focus();
        return;
      }
      var peran = 'Pendukung';
      var checked = form.querySelector('input[name="peran"]:checked');
      if (checked) peran = checked.value;
      var arr = loadSupporters();
      arr.unshift({
        nama: nama.value.trim(),
        prodi: prodi.value.trim(),
        pesan: pesan ? pesan.value.trim() : '',
        peran: peran,
        waktu: new Date().toISOString()
      });
      saveSupporters(arr);
      renderSupporters();
      form.reset();
      if (pesanCount) pesanCount.textContent = '0';
      if (formStatus) {
        formStatus.textContent = 'Dukunganmu tercatat di perangkat ini. Terima kasih!';
        formStatus.classList.add('ok');
      }
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      saveSupporters([]);
      renderSupporters();
      if (formStatus) { formStatus.textContent = 'Semua dukungan lokal dihapus.'; formStatus.classList.remove('ok'); }
    });
  }
  renderSupporters();
})();
