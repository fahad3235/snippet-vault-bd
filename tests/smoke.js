// Headless-Chrome smoke test via raw CDP (no puppeteer dependency).
// Usage: node tests/smoke.js — exits non-zero on any failure or page error.
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const PORT = 9349;
const FILE = 'file://' + path.resolve(__dirname, '..', 'index.html');
let failures = 0;
const pageErrors = [];
function check(name, cond, extra) {
  console.log((cond ? 'ok - ' : 'FAIL - ') + name + (cond ? '' : ' :: ' + (extra || '')));
  if (!cond) failures++;
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function poll(fn, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try { if (await fn()) return true; } catch (e) { /* retry */ }
    await wait(200);
  }
  return false;
}

(async () => {
  const chrome = spawn('/opt/meta-chromium/chrome', [
    '--headless=new', '--no-sandbox', '--disable-gpu',
    '--remote-debugging-port=' + PORT, '--user-data-dir=/tmp/sv-smoke-' + process.pid,
    'about:blank',
  ], { stdio: 'ignore' });
  let targets = [];
  for (let i = 0; i < 50 && targets.length === 0; i++) {
    await wait(200);
    try {
      targets = JSON.parse(await new Promise((res, rej) => {
        http.get('http://127.0.0.1:' + PORT + '/json/list', (r) => {
          let d = ''; r.on('data', (c) => (d += c)); r.on('end', () => res(d));
        }).on('error', rej);
      }));
    } catch (e) { /* retry */ }
  }
  if (!targets.length) { console.log('FAIL - chrome did not start'); process.exit(2); }
  const wsUrl = targets[0].webSocketDebuggerUrl;
  const ws = new WebSocket(wsUrl);
  await new Promise((res) => { ws.onopen = res; });
  let seq = 0; const pending = new Map();
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      pageErrors.push(JSON.stringify(msg.params.args));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      pageErrors.push(JSON.stringify(msg.params.exceptionDetails).slice(0, 300));
    }
  };
  const send = (method, params) => new Promise((res) => {
    const id = ++seq; pending.set(id, res); ws.send(JSON.stringify({ id, method, params }));
  });
  const ev = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.result && r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 300));
    return r.result ? r.result.result.value : undefined;
  };
  await send('Page.enable', {});
  await send('Runtime.enable', {});
  await send('Page.navigate', { url: FILE });
  await poll(async () => (await ev('!!document.getElementById("snippetForm")')), 10000);

  check('title is Snippet Vault BD', (await ev('document.title')).indexOf('Snippet Vault BD') === 0);
  check('empty state shown initially', (await ev('document.querySelector("#list .empty") ? true : false')));
  check('stats start 0 snippets', (await ev('document.getElementById("stats").textContent')).indexOf('0') === 0);

  // Empty-title validation blocks submit
  await ev(`document.getElementById('fTitle').value=''; document.getElementById('fCode').value='x=1';
    document.getElementById('snippetForm').dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));`);
  await wait(200);
  check('empty title shows inline error, no card added',
    (await ev('document.getElementById("msg").style.display')) === 'block' &&
    (await ev('document.querySelectorAll("#list .card").length')) === 0);

  // Add snippet 1 (Python, 3 lines)
  const code1 = 'def qs(a):\n    return sorted(a)\nprint(qs([3,1]))';
  await ev(`document.getElementById('fTitle').value='Quick sort';
    document.getElementById('fLang').value='Python';
    document.getElementById('fCode').value=` + JSON.stringify(code1) + `;
    document.getElementById('fDesc').value='tiny sort demo';
    document.getElementById('fTags').value='sorting, array';
    document.getElementById('snippetForm').dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));`);
  await wait(300);
  check('card added with title + lang badge + 3 lines',
    (await ev('document.querySelectorAll("#list .card").length')) === 1 &&
    (await ev('document.querySelector("#list .card h3").textContent')) === 'Quick sort' &&
    (await ev('document.querySelector("#list .card").textContent')).indexOf('3 lines') !== -1);
  check('stats show 1 snippet', (await ev('document.getElementById("stats").textContent')).indexOf('1') === 0);
  check('code text is escaped + rendered', (await ev('document.querySelector("#list .card code").textContent')).indexOf('def qs(a):') === 0);

  // Add snippet 2 (JS) then favorite snippet 1
  await ev(`document.getElementById('fTitle').value='Debounce';
    document.getElementById('fLang').value='JavaScript';
    document.getElementById('fCode').value='const d=(f,t)=>{let i;return(...a)=>{clearTimeout(i);i=setTimeout(()=>f(...a),t)}};';
    document.getElementById('fTags').value='timing';
    document.getElementById('snippetForm').dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));`);
  await wait(300);
  check('second card added (newest first)', (await ev('document.querySelectorAll("#list .card").length')) === 2 &&
    (await ev('document.querySelector("#list .card h3").textContent')) === 'Debounce');
  await ev(`document.querySelectorAll('#list .card')[1].querySelector('button[data-act="fav"]').click();`);
  await wait(200);
  check('favorite star toggles + stats favorites 1',
    (await ev('document.querySelectorAll("#list .card")[1].querySelector(".star").textContent')) === '★' &&
    (await ev('document.getElementById("stats").textContent')).indexOf('1 favorites') !== -1);

  // Search filter
  await ev(`document.getElementById('searchInput').value='debounce'; document.getElementById('searchInput').dispatchEvent(new Event('input', {bubbles: true}));`);
  await wait(200);
  check('search filters to 1 card', (await ev('document.querySelectorAll("#list .card").length')) === 1);
  await ev(`document.getElementById('searchInput').value=''; document.getElementById('searchInput').dispatchEvent(new Event('input', {bubbles: true}));`);
  await wait(200);
  // Language filter
  await ev(`document.getElementById('langFilter').value='Python'; document.getElementById('langFilter').dispatchEvent(new Event('change', {bubbles: true}));`);
  await wait(200);
  check('language filter shows only Python card', (await ev('document.querySelectorAll("#list .card").length')) === 1 &&
    (await ev('document.querySelector("#list .card h3").textContent')) === 'Quick sort');
  await ev(`document.getElementById('langFilter').value='All'; document.getElementById('langFilter').dispatchEvent(new Event('change', {bubbles: true}));`);
  await wait(200);
  // Fav-only filter
  await ev(`document.getElementById('favOnly').checked=true; document.getElementById('favOnly').dispatchEvent(new Event('change', {bubbles: true}));`);
  await wait(200);
  check('favorites-only shows 1 card', (await ev('document.querySelectorAll("#list .card").length')) === 1);
  await ev(`document.getElementById('favOnly').checked=false; document.getElementById('favOnly').dispatchEvent(new Event('change', {bubbles: true}));`);
  await wait(200);

  // Edit: change title of first card (Debounce)
  await ev(`document.querySelector('#list .card button[data-act="edit"]').click();`);
  await wait(200);
  check('edit prefills form', (await ev('document.getElementById("fTitle").value')) === 'Debounce');
  await ev(`document.getElementById('fTitle').value='Debounce v2';
    document.getElementById('snippetForm').dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));`);
  await wait(300);
  check('edit saves new title', (await ev('document.querySelector("#list .card h3").textContent')) === 'Debounce v2');

  // Persistence across reload
  await send('Page.navigate', { url: FILE });
  await poll(async () => (await ev('document.querySelectorAll("#list .card").length')) === 2, 10000);
  check('reload persists 2 snippets', (await ev('document.querySelectorAll("#list .card").length')) === 2);

  // BN toggle: tagline + Bengali digits in stats
  await ev(`document.getElementById('langBtn').click();`);
  await wait(300);
  check('BN toggle changes tagline + Bengali digits', await (async () => {
    const tag = await ev('document.getElementById("tagline").textContent');
    const stats = await ev('document.getElementById("stats").textContent');
    return tag !== 'Your offline code snippet library' && /[\u09e6-\u09ef]/.test(stats);
  })());
  await ev(`document.getElementById('langBtn').click();`);
  await wait(300);
  check('toggle back to English', (await ev('document.getElementById("tagline").textContent')) === 'Your offline code snippet library');

  // Delete with confirm stubbed true
  await ev(`window.confirm = function(){ return true; };
    document.querySelector('#list .card button[data-act="del"]').click();`);
  await wait(300);
  check('delete removes one card', (await ev('document.querySelectorAll("#list .card").length')) === 1);

  check('390px mobile: no horizontal overflow', await (async () => {
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await wait(300);
    const w = await ev('document.documentElement.scrollWidth');
    await send('Emulation.clearDeviceMetricsOverride', {});
    return w <= 390;
  })());

  check('zero console/page errors', pageErrors.length === 0, pageErrors.join(' | ').slice(0, 300));

  try { ws.close(); } catch (e) {}
  chrome.kill();
  console.log(failures === 0 ? 'smoke: ALL PASS' : `smoke: ${failures} FAILURES`);
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.log('smoke harness error: ' + e.message); process.exit(2); });
