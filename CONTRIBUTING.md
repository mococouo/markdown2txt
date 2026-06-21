# Contributing

Thanks for improving Markdown to TXT.

## Local setup

No build step is required.

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Guidelines

- Keep the app static and dependency-free.
- Do not add CDN dependencies.
- Do not upload or persist user content.
- Keep conversion behavior predictable and test with small Markdown samples.
- When adding a language, update `languageMeta` and `translations` in `script.js`.
- Keep RTL languages usable by checking Arabic or Hebrew layout.

## Pull requests

Include:

- What changed.
- Which conversion mode or language is affected.
- Manual browser checks performed.
