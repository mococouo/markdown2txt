# Markdown to TXT

![Status](https://img.shields.io/badge/status-beta-orange)
![License](https://img.shields.io/badge/license-MIT-green)
![Zero dependencies](https://img.shields.io/badge/dependencies-zero-blue)

A zero-install, offline Markdown to TXT converter that runs entirely in your browser.

Use it to turn Markdown notes, AI outputs, documentation drafts, copied web content, and Obsidian notes into clean plain text. It supports manual input, drag-and-drop, batch files, output rules, multilingual UI, copy, and download.

## Highlights

- Fully static: just `index.html`, `styles.css`, and `script.js`.
- Offline-first: no server, no CDN, no upload.
- Batch-ready: drag multiple `.md`, `.markdown`, or `.txt` files.
- Three conversion styles: Standard, Clean, and Structured.
- Output rule toggles for links, code blocks, and front matter.
- Copy current result, download current output, or merge-download all outputs.
- Multilingual UI with LTR and RTL support.
- Works directly from local files or GitHub Pages.

## Try It

Open locally:

```text
index.html
```

Or serve locally:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Languages

The UI currently includes:

```text
English, 简体中文, 繁體中文, 日本語, 한국어, Español, Português,
ไทย, עברית, Русский, العربية, Français, Deutsch, Italiano,
हिन्दी, Bahasa Indonesia, Tiếng Việt, Türkçe, Polski, Nederlands
```

Arabic and Hebrew use RTL layout automatically.

## Conversion Modes

- **Standard**: removes Markdown syntax while keeping readable paragraphs, list structure, links, and code content.
- **Clean**: produces compact plain text for pasting into simple editors or forms.
- **Structured**: preserves heading hierarchy and code boundaries for readable archives.

## Project Structure

```text
index.html          Static app shell
styles.css          App styling and responsive layout
script.js           Conversion logic, file handling, and i18n
examples/           Sample Markdown files
docs/               Usage, packaging, and roadmap notes
legacy/             Older Python implementations kept for reference
```

## GitHub Pages

This project is a static site. To publish it:

1. Push the repository to GitHub.
2. Open `Settings` -> `Pages`.
3. Choose `Deploy from a branch`.
4. Select `main` and `/root`.
5. Save and open the generated Pages URL.

## Privacy

Markdown to TXT does not upload content. Normal conversion runs completely in the browser on your machine.

Clipboard access may require HTTPS or localhost in some browsers. Manual paste still works.

## Development

No build step is required.

Recommended quick check:

```bash
python -m http.server 8000
```

Then test in a browser:

```text
http://localhost:8000
```

## Roadmap

See [docs/roadmap.md](docs/roadmap.md).

## License

MIT. See [LICENSE](LICENSE).
