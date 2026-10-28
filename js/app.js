// Snippet Vault BD \u2014 DOM glue. All user-visible strings live in I18N (EN + BN).
(function () {
  'use strict';
  var L = window.SnippetLogic;
  var I18N = {
    en: {
      tagline: 'Your offline code snippet library',
      addTitle: 'Add snippet', editTitle: 'Edit snippet',
      title: 'Title', language: 'Language', code: 'Code', desc: 'Description (optional)',
      tags: 'Tags (comma separated)', save: 'Save snippet', cancel: 'Cancel',
      search: 'Search title, code, tags...', allLang: 'All languages', allTags: 'All tags',
      favOnly: 'Favorites only', sortNew: 'Newest first', sortOld: 'Oldest first', sortTitle: 'Title A-Z',
      copy: 'Copy', edit: 'Edit', del: 'Delete', fav: 'Favorite', unfav: 'Unfavorite',
      lines: 'lines', chars: 'chars', total: 'snippets', favorites: 'favorites',
      empty: 'No snippets yet. Add your first snippet above \u2014 it stays in this browser only.',
      emptyFilter: 'No snippets match the current filters.',
      exportBtn: 'Export JSON', importBtn: 'Import JSON', clearBtn: 'Erase all',
      confirmClear: 'Type DELETE to erase all snippets',
      errTitle: 'Title is required (max 100 chars).', errCode: 'Code is required.',
      errLang: 'Pick a language from the list.', errImport: 'Import failed: invalid file.',
      importOk: 'Imported successfully.', copied: 'Copied!',
      footer: 'Offline personal tool. Snippets live only in this browser (localStorage). No account, no server, no tracking.',
      deleteConfirm: 'Delete this snippet?'
    },
    bn: {
      tagline: '\u0986\u09aa\u09a8\u09be\u09b0 \u0985\u09ab\u09b2\u09be\u0987\u09a8 \u0995\u09cb\u09a1 \u09b8\u09cd\u09a8\u09bf\u09aa\u09c7\u099f \u09b2\u09be\u0987\u09ac\u09cd\u09b0\u09c7\u09b0\u09bf',
      addTitle: '\u09b8\u09cd\u09a8\u09bf\u09aa\u09c7\u099f \u09af\u09cb\u0997 \u0995\u09b0\u09c1\u09a8', editTitle: '\u09b8\u09cd\u09a8\u09bf\u09aa\u09c7\u099f \u09b8\u09ae\u09cd\u09aa\u09be\u09a6\u09a8\u09be \u0995\u09b0\u09c1\u09a8',
      title: '\u09b6\u09bf\u09b0\u09cb\u09a8\u09be\u09ae', language: '\u09ad\u09be\u09b7\u09be', code: '\u0995\u09cb\u09a1', desc: '\u09ac\u09b0\u09cd\u09a3\u09a8\u09be (\u0990\u099a\u09cd\u099b\u09bf\u0995)',
      tags: '\u099f\u09cd\u09af\u09be\u0997 (\u0995\u09ae\u09be \u09a6\u09bf\u09af\u09bc\u09c7 \u0986\u09b2\u09be\u09a6\u09be \u0995\u09b0\u09c1\u09a8)', save: '\u09b8\u09cd\u09a8\u09bf\u09aa\u09c7\u099f \u09b8\u0982\u09b0\u0995\u09cd\u09b7\u09a3 \u0995\u09b0\u09c1\u09a8', cancel: '\u09ac\u09be\u09a4\u09bf\u09b2',
      search: '\u09b6\u09bf\u09b0\u09cb\u09a8\u09be\u09ae, \u0995\u09cb\u09a1, \u099f\u09cd\u09af\u09be\u0997 \u0996\u09c1\u0981\u099c\u09c1\u09a8...', allLang: '\u09b8\u09ac \u09ad\u09be\u09b7\u09be', allTags: '\u09b8\u09ac \u099f\u09cd\u09af\u09be\u0997',
      favOnly: '\u09b6\u09c1\u09a7\u09c1 \u09aa\u09cd\u09b0\u09bf\u09af\u09bc', sortNew: '\u09a8\u09a4\u09c1\u09a8 \u0986\u0997\u09c7', sortOld: '\u09aa\u09c1\u09b0\u09a8\u09cb \u0986\u0997\u09c7', sortTitle: '\u09b6\u09bf\u09b0\u09cb\u09a8\u09be\u09ae A-Z',
      copy: '\u0995\u09aa\u09bf', edit: '\u09b8\u09ae\u09cd\u09aa\u09be\u09a6\u09a8\u09be', del: '\u09ae\u09c1\u099b\u09c1\u09a8', fav: '\u09aa\u09cd\u09b0\u09bf\u09af\u09bc \u0995\u09b0\u09c1\u09a8', unfav: '\u09aa\u09cd\u09b0\u09bf\u09af\u09bc \u09a5\u09c7\u0995\u09c7 \u09b8\u09b0\u09be\u09a8',
      lines: '\u09b2\u09be\u0987\u09a8', chars: '\u0985\u0995\u09cd\u09b7\u09b0', total: '\u09b8\u09cd\u09a8\u09bf\u09aa\u09c7\u099f', favorites: '\u09aa\u09cd\u09b0\u09bf\u09af\u09bc',
      empty: '\u098f\u0996\u09a8\u09cb \u0995\u09cb\u09a8\u09cb \u09b8\u09cd\u09a8\u09bf\u09aa\u09c7\u099f \u09a8\u09c7\u0987\u0964 \u0989\u09aa\u09b0\u09c7 \u09aa\u09cd\u09b0\u09a5\u09ae \u09b8\u09cd\u09a8\u09bf\u09aa\u09c7\u099f \u09af\u09cb\u0997 \u0995\u09b0\u09c1\u09a8 \u2014 \u098f\u099f\u09bf \u09b6\u09c1\u09a7\u09c1 \u098f\u0987 \u09ac\u09cd\u09b0\u09be\u0989\u099c\u09be\u09b0\u09c7\u0987 \u09a5\u09be\u0995\u09ac\u09c7\u0964',
      emptyFilter: '\u09ac\u09b0\u09cd\u09a4\u09ae\u09be\u09a8 \u09ab\u09bf\u09b2\u09cd\u099f\u09be\u09b0\u09c7 \u0995\u09cb\u09a8\u09cb \u09b8\u09cd\u09a8\u09bf\u09aa\u09c7\u099f \u09ae\u09c7\u09b2\u09c7\u09a8\u09bf\u0964',
      exportBtn: 'JSON \u098f\u0995\u09cd\u09b8\u09aa\u09cb\u09b0\u09cd\u099f', importBtn: 'JSON \u0987\u09ae\u09aa\u09cb\u09b0\u09cd\u099f', clearBtn: '\u09b8\u09ac \u09ae\u09c1\u099b\u09c1\u09a8',
      confirmClear: '\u09b8\u09ac \u09b8\u09cd\u09a8\u09bf\u09aa\u09c7\u099f \u09ae\u09c1\u099b\u09a4\u09c7 DELETE \u09b2\u09bf\u0996\u09c1\u09a8',
      errTitle: '\u09b6\u09bf\u09b0\u09cb\u09a8\u09be\u09ae \u0986\u09ac\u09b6\u09cd\u09af\u0995 (\u09b8\u09b0\u09cd\u09ac\u09cb\u099a\u09cd\u099a \u09e7\u09e6\u09e6 \u0985\u0995\u09cd\u09b7\u09b0)\u0964', errCode: '\u0995\u09cb\u09a1 \u0986\u09ac\u09b6\u09cd\u09af\u0995\u0964',
      errLang: '\u09a4\u09be\u09b2\u09bf\u0995\u09be \u09a5\u09c7\u0995\u09c7 \u098f\u0995\u099f\u09bf \u09ad\u09be\u09b7\u09be \u09ac\u09c7\u099b\u09c7 \u09a8\u09bf\u09a8\u0964', errImport: '\u0987\u09ae\u09aa\u09cb\u09b0\u09cd\u099f \u09ac\u09cd\u09af\u09b0\u09cd\u09a5: \u09ab\u09be\u0987\u09b2\u099f\u09bf \u09b8\u09a0\u09bf\u0995 \u09a8\u09af\u09bc\u0964',
      importOk: '\u09b8\u09ab\u09b2\u09ad\u09be\u09ac\u09c7 \u0987\u09ae\u09aa\u09cb\u09b0\u09cd\u099f \u09b9\u09af\u09bc\u09c7\u099b\u09c7\u0964', copied: '\u0995\u09aa\u09bf \u09b9\u09af\u09bc\u09c7\u099b\u09c7!',
      footer: '\u0985\u09ab\u09b2\u09be\u0987\u09a8 \u09ac\u09cd\u09af\u0995\u09cd\u09a4\u09bf\u0997\u09a4 \u099f\u09c1\u09b2\u0964 \u09b8\u09cd\u09a8\u09bf\u09aa\u09c7\u099f \u09b6\u09c1\u09a7\u09c1 \u098f\u0987 \u09ac\u09cd\u09b0\u09be\u0989\u099c\u09be\u09b0\u09c7 (localStorage) \u09a5\u09be\u0995\u09c7\u0964 \u0995\u09cb\u09a8\u09cb \u0985\u09cd\u09af\u09be\u0995\u09be\u0989\u09a8\u09cd\u099f, \u09b8\u09be\u09b0\u09cd\u09ad\u09be\u09b0 \u09ac\u09be \u099f\u09cd\u09b0\u09cd\u09af\u09be\u0995\u09bf\u0982 \u09a8\u09c7\u0987\u0964',
      deleteConfirm: '\u098f\u0987 \u09b8\u09cd\u09a8\u09bf\u09aa\u09c7\u099f\u099f\u09bf \u09ae\u09c1\u099b\u09ac\u09c7\u09a8?'
    }
  };

  var KEY = 'snippet-vault-bd-v1', LANG_KEY = 'snippet-vault-bd-lang';
  var lang = localStorage.getItem(LANG_KEY) || 'en';
  var snippets = load();
  var editingId = null;
  var state = { query: '', language: 'All', tag: '', favOnly: false, sort: 'newest' };

  function t(k) { return (I18N[lang] || I18N.en)[k]; }
  function fmt(n) { return lang === 'bn' ? L.toBnDigits(n) : String(n); }
  function load() { try { var v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
  function persist() { localStorage.setItem(KEY, JSON.stringify(snippets)); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function uid() { return 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  function render() {
    document.getElementById('tagline').textContent = t('tagline');
    document.getElementById('langBtn').textContent = lang === 'en' ? '\u09ac\u09be\u0982\u09b2\u09be' : 'English';
    document.getElementById('formTitle').textContent = editingId ? t('editTitle') : t('addTitle');
    document.getElementById('searchInput').placeholder = t('search');
    document.getElementById('favLabel').textContent = t('favOnly');
    document.getElementById('exportBtn').textContent = t('exportBtn');
    document.getElementById('importBtn').textContent = t('importBtn');
    document.getElementById('clearBtn').textContent = t('clearBtn');
    document.getElementById('footerText').textContent = t('footer');
    var sortSel = document.getElementById('sortSel');
    sortSel.options[0].text = t('sortNew'); sortSel.options[1].text = t('sortOld'); sortSel.options[2].text = t('sortTitle');
    var langSel = document.getElementById('langFilter');
    langSel.options[0].text = t('allLang');
    var tagSel = document.getElementById('tagFilter');
    var curTag = tagSel.value;
    tagSel.innerHTML = '<option value="">' + esc(t('allTags')) + '</option>' +
      L.allTags(snippets).map(function (g) { return '<option value="' + esc(g) + '">' + esc(g) + '</option>'; }).join('');
    tagSel.value = curTag;
    document.getElementById('saveBtn').textContent = t('save');
    document.getElementById('cancelBtn').textContent = t('cancel');
    document.querySelector('label[for="fTitle"]').textContent = t('title');
    document.querySelector('label[for="fLang"]').textContent = t('language');
    document.querySelector('label[for="fCode"]').textContent = t('code');
    document.querySelector('label[for="fDesc"]').textContent = t('desc');
    document.querySelector('label[for="fTags"]').textContent = t('tags');

    var filtered = L.sortSnippets(L.filterSnippets(snippets, state), state.sort);
    var favCount = snippets.filter(function (s) { return s.fav; }).length;
    document.getElementById('stats').textContent =
      fmt(snippets.length) + ' ' + t('total') + ' \u00b7 ' + fmt(favCount) + ' ' + t('favorites');
    var list = document.getElementById('list');
    if (!snippets.length) { list.innerHTML = '<p class="empty">' + esc(t('empty')) + '</p>'; return; }
    if (!filtered.length) { list.innerHTML = '<p class="empty">' + esc(t('emptyFilter')) + '</p>'; return; }
    list.innerHTML = filtered.map(function (s) {
      return '<article class="card" data-id="' + esc(s.id) + '">' +
        '<div class="card-head"><h3>' + esc(s.title) + '</h3>' +
        '<button class="star" data-act="fav" title="' + esc(s.fav ? t('unfav') : t('fav')) + '">' + (s.fav ? '\u2605' : '\u2606') + '</button></div>' +
        '<div class="meta"><span class="lang-badge">' + esc(s.language) + '</span> ' +
        fmt(L.countLines(s.code)) + ' ' + t('lines') + ' \u00b7 ' + fmt(s.code.length) + ' ' + t('chars') +
        (s.tags.length ? ' \u00b7 ' + s.tags.map(function (g) { return '<span class="tag">#' + esc(g) + '</span>'; }).join(' ') : '') + '</div>' +
        (s.description ? '<p class="desc">' + esc(s.description) + '</p>' : '') +
        '<pre><code>' + esc(s.code) + '</code></pre>' +
        '<div class="actions"><button data-act="copy">' + esc(t('copy')) + '</button>' +
        '<button data-act="edit">' + esc(t('edit')) + '</button>' +
        '<button data-act="del">' + esc(t('del')) + '</button></div></article>';
    }).join('');
  }

  function showMsg(msg, isErr) {
    var el = document.getElementById('msg'); el.textContent = msg;
    el.className = 'msg' + (isErr ? ' err' : ' ok'); el.style.display = msg ? 'block' : 'none';
  }

  function resetForm() {
    editingId = null;
    ['fTitle', 'fLang', 'fCode', 'fDesc', 'fTags'].forEach(function (id) { document.getElementById(id).value = ''; });
    document.getElementById('fLang').value = 'JavaScript';
    render();
  }

  document.getElementById('langBtn').addEventListener('click', function () {
    lang = lang === 'en' ? 'bn' : 'en'; localStorage.setItem(LANG_KEY, lang); render();
  });
  document.getElementById('searchInput').addEventListener('input', function (e) { state.query = e.target.value; render(); });
  document.getElementById('langFilter').addEventListener('change', function (e) { state.language = e.target.value; render(); });
  document.getElementById('tagFilter').addEventListener('change', function (e) { state.tag = e.target.value; render(); });
  document.getElementById('favOnly').addEventListener('change', function (e) { state.favOnly = e.target.checked; render(); });
  document.getElementById('sortSel').addEventListener('change', function (e) { state.sort = e.target.value; render(); });
  document.getElementById('cancelBtn').addEventListener('click', resetForm);

  document.getElementById('snippetForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var input = { title: document.getElementById('fTitle').value,
      language: document.getElementById('fLang').value,
      code: document.getElementById('fCode').value,
      description: document.getElementById('fDesc').value,
      tags: document.getElementById('fTags').value };
    var v = L.validateSnippet(input);
    if (!v.ok) {
      var msg = v.errors.indexOf('title') !== -1 || v.errors.indexOf('title_long') !== -1 ? t('errTitle')
        : v.errors.indexOf('code') !== -1 ? t('errCode') : t('errLang');
      showMsg(msg, true); return;
    }
    if (editingId) {
      var s = snippets.find(function (x) { return x.id === editingId; });
      if (s) { s.title = v.value.title; s.language = v.value.language; s.code = v.value.code; s.description = v.value.description; s.tags = v.value.tags; }
    } else {
      snippets.push({ id: uid(), createdAt: Date.now(), fav: false,
        title: v.value.title, language: v.value.language, code: v.value.code,
        description: v.value.description, tags: v.value.tags });
    }
    persist(); showMsg('', false); resetForm();
  });

  document.getElementById('list').addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-act]'); if (!btn) return;
    var card = e.target.closest('.card'); var s = snippets.find(function (x) { return x.id === card.dataset.id; });
    if (!s) return;
    var act = btn.dataset.act;
    if (act === 'fav') { s.fav = !s.fav; persist(); render(); }
    else if (act === 'edit') {
      editingId = s.id;
      document.getElementById('fTitle').value = s.title;
      document.getElementById('fLang').value = s.language;
      document.getElementById('fCode').value = s.code;
      document.getElementById('fDesc').value = s.description;
      document.getElementById('fTags').value = s.tags.join(', ');
      render(); document.getElementById('snippetForm').scrollIntoView({ behavior: 'smooth' });
    }
    else if (act === 'del') { if (confirm(t('deleteConfirm'))) { snippets = snippets.filter(function (x) { return x.id !== s.id; }); persist(); render(); } }
    else if (act === 'copy') {
      var done = function () { showMsg(t('copied'), false); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(s.code).then(done).catch(done);
      else done();
    }
  });

  document.getElementById('exportBtn').addEventListener('click', function () {
    var blob = new Blob([JSON.stringify({ app: 'snippet-vault-bd', version: 1, snippets: snippets }, null, 2)], { type: 'application/json' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'snippet-vault-export.json'; a.click();
  });
  document.getElementById('importBtn').addEventListener('click', function () { document.getElementById('fileInput').click(); });
  document.getElementById('fileInput').addEventListener('change', function (e) {
    var f = e.target.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var v = L.validateImport(JSON.parse(r.result));
        if (!v.ok) throw new Error('bad');
        snippets = v.snippets; persist(); render(); showMsg(t('importOk'), false);
      } catch (err) { showMsg(t('errImport'), true); }
    };
    r.readAsText(f); e.target.value = '';
  });
  document.getElementById('clearBtn').addEventListener('click', function () {
    if (prompt(t('confirmClear')) === 'DELETE') { snippets = []; persist(); resetForm(); }
  });

  var langSel = document.getElementById('langFilter');
  L.LANGUAGES.forEach(function (lg) { var o = document.createElement('option'); o.value = lg; o.textContent = lg; langSel.appendChild(o); });
  var fLang = document.getElementById('fLang');
  L.LANGUAGES.forEach(function (lg) { var o = document.createElement('option'); o.value = lg; o.textContent = lg; fLang.appendChild(o); });
  render();
})();
