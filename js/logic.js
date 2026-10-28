// Snippet Vault BD — pure logic (no DOM). Shared by the app and the node tests.
(function (root) {
  'use strict';
  var LANGUAGES = ['JavaScript', 'Python', 'HTML', 'CSS', 'SQL', 'Bash', 'Java', 'C++'];
  var MAX_TITLE = 100, MAX_CODE = 20000, MAX_DESC = 500, MAX_TAGS = 10;

  function trim(s) { return (s == null ? '' : String(s)).trim(); }

  function parseTags(raw) {
    if (raw == null) return [];
    var parts = String(raw).split(',').map(function (t) { return trim(t); })
      .filter(function (t) { return t.length > 0; });
    var seen = {}, out = [];
    parts.forEach(function (t) { var k = t.toLowerCase(); if (!seen[k]) { seen[k] = true; out.push(t); } });
    return out.slice(0, MAX_TAGS);
  }

  function validateSnippet(input) {
    var errors = [];
    var title = trim(input.title);
    var code = input.code == null ? '' : String(input.code);
    if (!title) errors.push('title');
    if (title.length > MAX_TITLE) errors.push('title_long');
    if (!trim(code)) errors.push('code');
    if (code.length > MAX_CODE) errors.push('code_long');
    if (LANGUAGES.indexOf(input.language) === -1) errors.push('language');
    if (trim(input.description).length > MAX_DESC) errors.push('desc_long');
    var tags = parseTags(input.tags);
    if (tags.some(function (t) { return t.length > 30; })) errors.push('tag_long');
    return { ok: errors.length === 0, errors: errors, value: {
      title: title, language: input.language, code: code,
      description: trim(input.description), tags: tags } };
  }

  function countLines(code) {
    if (!code) return 0;
    return String(code).split('\n').length;
  }

  function filterSnippets(snippets, opts) {
    opts = opts || {};
    var q = trim(opts.query).toLowerCase();
    var lang = opts.language || 'All';
    var tag = opts.tag || '';
    var favOnly = !!opts.favOnly;
    return snippets.filter(function (s) {
      if (favOnly && !s.fav) return false;
      if (lang !== 'All' && s.language !== lang) return false;
      if (tag && s.tags.map(function (t) { return t.toLowerCase(); }).indexOf(tag.toLowerCase()) === -1) return false;
      if (q) {
        var hay = (s.title + '\n' + s.code + '\n' + s.description + '\n' + s.tags.join(' ')).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function sortSnippets(snippets, mode) {
    var arr = snippets.slice();
    if (mode === 'title') arr.sort(function (a, b) { return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1; });
    else if (mode === 'oldest') arr.sort(function (a, b) { return a.createdAt - b.createdAt; });
    else arr.sort(function (a, b) { return b.createdAt - a.createdAt; });
    return arr;
  }

  function allTags(snippets) {
    var seen = {}, out = [];
    snippets.forEach(function (s) { s.tags.forEach(function (t) {
      var k = t.toLowerCase(); if (!seen[k]) { seen[k] = true; out.push(t); } }); });
    return out.sort(function (a, b) { return a.toLowerCase() < b.toLowerCase() ? -1 : 1; });
  }

  function validateImport(data) {
    if (!data || typeof data !== 'object' || !Array.isArray(data.snippets)) return { ok: false, error: 'bad_shape' };
    if (data.snippets.length > 1000) return { ok: false, error: 'too_many' };
    var ids = {};
    for (var i = 0; i < data.snippets.length; i++) {
      var s = data.snippets[i];
      if (!s || typeof s !== 'object') return { ok: false, error: 'bad_item' };
      if (typeof s.id !== 'string' || !s.id || ids[s.id]) return { ok: false, error: 'bad_id' };
      ids[s.id] = true;
      var v = validateSnippet({ title: s.title, language: s.language, code: s.code,
        description: s.description || '', tags: (s.tags || []).join(',') });
      if (!v.ok) return { ok: false, error: 'bad_item' };
      if (typeof s.createdAt !== 'number' || typeof s.fav !== 'boolean') return { ok: false, error: 'bad_item' };
    }
    return { ok: true, snippets: data.snippets };
  }

  function toBnDigits(s) {
    var map = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(s).replace(/[0-9]/g, function (d) { return map[+d]; });
  }

  var api = { LANGUAGES: LANGUAGES, parseTags: parseTags, validateSnippet: validateSnippet,
    countLines: countLines, filterSnippets: filterSnippets, sortSnippets: sortSnippets,
    allTags: allTags, validateImport: validateImport, toBnDigits: toBnDigits };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SnippetLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
