# Changelog

## 0.4.0

### Added

- Dark mode with manual toggle, system preference detection, and persistence.
- ZIP batch download using a built-in store-mode ZIP packer (no dependencies).
- Conversion presets: AI dataset cleaning, documentation archive, publishing.
- Keyboard shortcuts help dialog, toggled with `?`.
- New shortcuts: `Ctrl+D` downloads current, `?` toggles help, `Esc` closes dialog.
- PWA support: installable via `manifest.webmanifest` and offline-cached via `sw.js`.
- File queue supports per-file removal and drag-and-drop reordering.
- Stats now show characters, lines, words, and estimated reading time.
- CJK word counting (Chinese/Japanese/Korean counted per character).
- Conversion pipeline refactored into named steps for testability.
- Math formula support: inline `$...$` and block `$$...$$` extracted and reinserted.
- Footnote references `[^id]` and definitions stripped from output.
- Auto-links `<http://x>` converted to plain URLs.
- Inline HTML allowlist preserves `<kbd>`, `<sup>`, `<sub>`, `<abbr>`, etc.
- Admonitions (`!!! note ...`) collapsed to `[type] body`.
- Definition lists (`Term\n: definition`) converted to `Term: definition`.
- Reference link definitions `[1]: url` removed from output.
- Content-Security-Policy meta tag.
- 5 MB file size limit with status warning.
- Skip-to-input accessibility link.
- `:focus-visible` outlines for keyboard navigation.
- Explicit `for`/`id` associations on all checkboxes.
- Debounced auto-convert (200 ms) for large input.
- Completed translations for fr, de, it, hi, id, vi, tr, pl, nl (all 60 keys).

### Fixed

- Code block placeholder tokens no longer collide with emphasis markers.
- Table rows and headings no longer swallow adjacent blank lines.
- `Clear files` now also clears the editor and output panes.
- Loading a new batch of files appends to the queue instead of replacing it.
- Clean mode inserts blank-line separators around code blocks.
- `runConversion` no longer writes the output twice for the active file.
- HTML entities (`&amp;`, `&lt;`, `&gt;`) pass through unchanged.
- Nested list items preserve indentation in all modes.

## 0.2.0

- Added a polished offline static web app.
- Added batch file queue, drag-and-drop, copy, current download, and merged download.
- Added Standard, Clean, and Structured conversion modes.
- Added output rule toggles for links, code blocks, and front matter.
- Added multilingual UI with broad global language coverage and RTL support.
- Reorganized repository files for GitHub release readiness.

## 0.1.0

- Initial Markdown to plain text conversion scripts.
