# Markdown to TXT Web App

This is a zero-dependency, offline-first Markdown to TXT converter. It runs from static files and does not require Node, Python, a server, or any browser extension.

## Features

- English default UI with Chinese language switch
- Paste, manual input, file picker, and drag-and-drop
- Multi-file queue and batch conversion
- Standard, Clean, and Structured conversion styles
- Rule toggles for links, code blocks, and front matter
- Input/output character and line counts
- Copy result, download current output, or merge-download all outputs
- No CDN and no network request required for normal use

## Deployment

Place these files in the same directory:

```text
index.html
styles.css
script.js
```

Local preview:

```bash
python -m http.server 8000
```

Visit:

```text
http://localhost:8000
```

Directly opening `index.html` also works.

## Browser Support

- Chrome / Edge 79+
- Firefox 70+
- Safari 13+

Clipboard buttons may require HTTPS or localhost in some browsers. Manual copy and paste still work.

## GitHub Positioning

Recommended short description:

```text
Offline Markdown to TXT converter with batch processing and a bilingual UI.
```

Recommended topics:

```text
markdown, txt, offline, converter, batch, privacy, static-site
```
