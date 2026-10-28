// Node unit tests for snippet-vault-bd logic.js — run: node tests/test.js
const L = require('../js/logic.js');
let pass = 0, fail = 0;
function check(name, cond) { if (cond) { pass++; } else { fail++; console.log('FAIL: ' + name); } }
function eq(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

// parseTags
check('tags split+trim', eq(L.parseTags('a, b ,a, ,C'), ['a', 'b', 'C']));
check('tags empty', eq(L.parseTags(''), []));
check('tags cap 10', L.parseTags('1,2,3,4,5,6,7,8,9,10,11').length === 10);

// validateSnippet
check('valid ok', L.validateSnippet({ title: 'Hi', language: 'Python', code: 'print(1)', description: '', tags: 'x' }).ok);
check('empty title rejected', !L.validateSnippet({ title: ' ', language: 'Python', code: 'x', description: '', tags: '' }).ok);
check('empty code rejected', !L.validateSnippet({ title: 'T', language: 'Python', code: '  ', description: '', tags: '' }).ok);
check('bad language rejected', !L.validateSnippet({ title: 'T', language: 'Ruby', code: 'x', description: '', tags: '' }).ok);
check('long title rejected', !L.validateSnippet({ title: 'x'.repeat(101), language: 'Python', code: 'x', description: '', tags: '' }).ok);
check('8 languages', L.LANGUAGES.length === 8);

// countLines
check('lines 1', L.countLines('a') === 1);
check('lines 3', L.countLines('a\nb\nc') === 3);
check('lines empty 0', L.countLines('') === 0);

// filter/sort
const S = [
  { id: '1', title: 'Sort array', language: 'JavaScript', code: 'arr.sort()', description: '', tags: ['array'], fav: true, createdAt: 100 },
  { id: '2', title: 'Read file', language: 'Python', code: 'open(f)', description: '', tags: ['io'], fav: false, createdAt: 200 },
  { id: '3', title: 'Sort dict', language: 'Python', code: 'sorted(d)', description: '', tags: ['array'], fav: false, createdAt: 300 },
];
check('query sort', L.filterSnippets(S, { query: 'sort' }).length === 2);
check('lang filter', L.filterSnippets(S, { language: 'Python' }).length === 2);
check('tag filter', L.filterSnippets(S, { tag: 'array' }).length === 2);
check('fav filter', L.filterSnippets(S, { favOnly: true }).length === 1);
check('combined', L.filterSnippets(S, { query: 'sort', language: 'Python' }).length === 1);
check('no match', L.filterSnippets(S, { query: 'zzz' }).length === 0);
check('sort newest', L.sortSnippets(S, 'newest')[0].id === '3');
check('sort oldest', L.sortSnippets(S, 'oldest')[0].id === '1');
check('sort title', L.sortSnippets(S, 'title')[0].id === '2');
check('allTags', eq(L.allTags(S), ['array', 'io']));

// validateImport
const good = { snippets: [{ id: 'a', title: 'T', language: 'SQL', code: 'SELECT 1', description: '', tags: ['db'], fav: false, createdAt: 5 }] };
check('import good', L.validateImport(good).ok);
check('import bad shape', !L.validateImport({}).ok);
check('import dup id', !L.validateImport({ snippets: [good.snippets[0], good.snippets[0]] }).ok);
check('import bad lang', !L.validateImport({ snippets: [{ id: 'b', title: 'T', language: 'Nope', code: 'x', description: '', tags: [], fav: false, createdAt: 1 }] }).ok);
check('import bad fav type', !L.validateImport({ snippets: [{ id: 'b', title: 'T', language: 'SQL', code: 'x', description: '', tags: [], fav: 0, createdAt: 1 }] }).ok);

// digits
check('bn digits', L.toBnDigits('2026') === '২০২৬');
check('bn digits mixed', L.toBnDigits('a1b2') === 'a১b২');

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
