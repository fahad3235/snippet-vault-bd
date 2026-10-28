# Snippet Vault BD

Offline, bilingual (English / বাংলা) code-snippet manager that runs entirely in
your browser. Save reusable code snippets with a language, description and tags,
then search, filter, favorite, copy and export them — no account, no server.

## Features

1. **Snippet CRUD** — add, edit and delete snippets with inline validation
   (title and code required, language from an 8-language list, tags capped).
2. **Search & filters** — full-text search across title, code, description and
   tags, plus language filter, tag filter and favorites-only view.
3. **Copy & counts** — one-click copy to clipboard, plus line and character
   counts per snippet.
4. **Favorites & sorting** — star snippets; sort by newest, oldest or title.
5. **Export / import** — JSON export and strict import validation (bad files
   are rejected with your data intact); typed-DELETE erase-all.
6. **Bilingual UI** — EN / বাংলা toggle persisted in localStorage, with
   Bengali-digit rendering for counts in Bangla mode.
7. **Fully offline** — everything lives in localStorage; zero network requests.

## Stack

Vanilla HTML, CSS and JavaScript. No build step, no dependencies, no CDN.

## Run locally

Open `index.html` in any modern browser, or serve the folder:

```sh
npx serve .
# or
python3 -m http.server 8000
```

## Testing

```sh
node tests/test.js    # 29 pure-logic unit checks
node tests/smoke.js   # 20 headless-Chrome (CDP) UI checks, 0 console errors
```

## Deployment

Static site — GitHub Pages (main branch, root) or any static host.

## Limitations

- Snippets live only in the browser where they were saved (localStorage);
  there is no sync across devices. Use Export JSON to move them.
- Copy uses the Clipboard API where available and degrades silently otherwise.
- This is a personal organizer, not a code-execution environment: snippets are
  never run, only stored and displayed (HTML-escaped).

## Status

MVP complete. See `TEST_RESULTS.md` for verified test results.
