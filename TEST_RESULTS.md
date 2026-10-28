# TEST_RESULTS — snippet-vault-bd (run #169, 2026-10-28)

## Node unit tests — 29/29 pass

`node tests/test.js` — tag parsing (split/trim/dedupe/cap-10), snippet
validation (empty title/code, bad language, long title), line counting,
filter combinations (query/language/tag/favorites, no-match), sorting
(newest/oldest/title), tag aggregation, import validation (bad shape, duplicate
id, bad language, bad fav type), Bengali-digit conversion (2026 -> ২০২৬).

## Headless-Chrome smoke — 20/20 pass, 0 console/page errors

`node tests/smoke.js` (raw CDP, /opt/meta-chromium/chrome, file://) —
empty state, stats start at 0, empty-title inline error blocks submit, add
Python snippet (3 lines counted), add JS snippet newest-first, favorite star +
stats, search filter, language filter, favorites-only filter, edit prefill +
save, reload persistence of 2 snippets, BN toggle (tagline + Bengali digits)
and back, delete, 390px no-overflow, zero console/page errors.

## Repairs

1 test-harness fix only (smoke script passed a raw newline into an evaluated
single-quoted JS string; fixed by JSON.stringify-ing the code value).
0 app bugs found.
