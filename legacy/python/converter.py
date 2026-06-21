# -*- coding: utf-8 -*-
"""Shared Markdown-to-plain-text conversion core.

Used by the Tkinter GUI (markdown2txt.py, markdown2txt_simple.py) and the
command-line tool (cli.py). The transform mirrors the in-browser
``script.js`` implementation so the two stay in sync and can be validated by
the snapshot tests under ``tests/``.

Options
-------
mode : str
    ``normal`` | ``clean`` | ``structured`` preset.
keep_links : bool
    Preserve link URLs as ``text (url)`` instead of dropping the URL.
keep_code : bool
    Keep fenced code block bodies.
remove_frontmatter : bool
    Strip a leading YAML front matter block.
keep_headings : bool
    Preserve heading hierarchy (setext for h1/h2, ``#`` for h3-h6) even in
    modes that would otherwise flatten headings.
keep_tables : bool
    Keep ``| col | col |`` row shape instead of flattening to tab separated.
keep_task_lists : bool
    Preserve ``[x]`` / ``[ ]`` checkbox markers.
keep_image_alt : bool
    Keep image alt text; when False images are dropped entirely.
keep_quote_prefix : bool
    Keep the ``> `` quote prefix instead of stripping it.
labels : dict
    Optional localised labels for code block fences. Keys: ``code_start``
    (template with ``{lang}``), ``code_end``.
"""

from __future__ import unicode_literals

import re

__all__ = ["convert", "DEFAULT_OPTIONS", "DEFAULT_LABELS", "__version__"]

__version__ = "1.1.0"

DEFAULT_OPTIONS = {
    "mode": "normal",
    "keep_links": True,
    "keep_code": True,
    "remove_frontmatter": True,
    "keep_headings": False,
    "keep_tables": False,
    "keep_task_lists": False,
    "keep_image_alt": True,
    "keep_quote_prefix": False,
}

DEFAULT_LABELS = {
    "code_start": "--- Code{lang} start ---",
    "code_end": "--- Code end ---",
}

_HEADING_RE = re.compile(r"^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$", re.MULTILINE)
_FRONTMATTER_RE = re.compile(r"^---\n[\s\S]*?\n---\n?")
_FENCED_RE = re.compile(r"```([\w-]*)\n?([\s\S]*?)```")
_COMMENT_RE = re.compile(r"<!--[\s\S]*?-->")
_BR_RE = re.compile(r"<br\s*/?>", re.IGNORECASE)
_BLOCK_CLOSE_RE = re.compile(r"</(p|div|li|tr|h[1-6])>", re.IGNORECASE)
_TAG_RE = re.compile(r"<[^>]+>")
_IMAGE_RE = re.compile(r"!\[([^\]]*)\]\([^)]+\)")
_IMAGE_DROP_RE = re.compile(r"!\[[^\]]*\]\([^)]+\)")
_LINK_INLINE_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
_LINK_REF_RE = re.compile(r"\[([^\]]+)\]\[[^\]]*\]")
_TABLE_SEP_RE = re.compile(
    r"^\s*\|?(\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*$", re.MULTILINE
)
_TABLE_ROW_RE = re.compile(r"^\s*\|(.+)\|\s*$", re.MULTILINE)
_INLINE_CODE_RE = re.compile(r"`([^`]+)`")
_BOLD_RE = re.compile(r"(\*\*|__)(.*?)\1")
_ITALIC_RE = re.compile(r"(\*|_)(.*?)\1")
_STRIKE_RE = re.compile(r"~~(.*?)~~")
_QUOTE_RE = re.compile(r"^\s{0,3}>\s?", re.MULTILINE)
_TASK_RE = re.compile(r"^(\s*)[-*+]\s+(\[[ xX]\]\s+)", re.MULTILINE)
_LIST_RE = re.compile(r"^\s*[-*+]\s+", re.MULTILINE)
_ORDERED_RE = re.compile(r"^\s*\d+\.\s+", re.MULTILINE)
_TRAILING_WS_RE = re.compile(r"[ \t]+\n")
_BLANK_RE = re.compile(r"\n{3,}")
_MULTI_SPACE_RE = re.compile(r"[ \t]{2,}")

_HTML_ENTITIES = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
    "&copy;": "\u00a9",
    "&reg;": "\u00ae",
    "&trade;": "\u2122",
    "&mdash;": "\u2014",
    "&ndash;": "\u2013",
    "&hellip;": "\u2026",
    "&laquo;": "\u00ab",
    "&raquo;": "\u00bb",
    "&middot;": "\u00b7",
    "&bull;": "\u2022",
    "&deg;": "\u00b0",
    "&euro;": "\u20ac",
    "&pound;": "\u00a3",
    "&yen;": "\u00a5",
}
_NUMERIC_ENTITY_RE = re.compile(r"&#(\d+);")
_HEX_ENTITY_RE = re.compile(r"&#x([0-9a-fA-F]+);", re.IGNORECASE)


def _normalize(text):
    return str(text or "").replace("\ufeff", "").replace("\r\n", "\n").replace("\r", "\n")


def _decode_entities(text):
    for entity, char in _HTML_ENTITIES.items():
        text = text.replace(entity, char)
    text = _NUMERIC_ENTITY_RE.sub(lambda m: _safe_chr(int(m.group(1))), text)
    text = _HEX_ENTITY_RE.sub(lambda m: _safe_chr(int(m.group(1), 16)), text)
    return text


def _safe_chr(code):
    try:
        return chr(code)
    except (ValueError, OverflowError):
        return ""


def _format_heading(match, opts):
    hashes, title = match.group(1), match.group(2).strip()
    level = len(hashes)
    if opts["mode"] == "structured" or opts["keep_headings"]:
        if level == 1:
            return "\n{}\n{}".format(title, "=" * max(len(title), 1))
        if level == 2:
            return "\n{}\n{}".format(title, "-" * max(len(title), 1))
        return "\n{} {}".format("#" * level, title)
    return title


def _format_code_block(code, lang, opts):
    clean = code.rstrip("\n")
    if not clean.strip():
        return ""
    if opts["mode"] == "clean":
        return clean
    labels = opts.get("labels") or DEFAULT_LABELS
    lang_part = " " + lang if lang else ""
    start = labels.get("code_start", DEFAULT_LABELS["code_start"]).format(lang=lang_part)
    end = labels.get("code_end", DEFAULT_LABELS["code_end"])
    return "{}\n{}\n{}".format(start, clean, end)


def _convert_tables(text, keep_tables):
    text = _TABLE_SEP_RE.sub("", text)
    if keep_tables:
        return text

    def _row(match):
        body = match.group(1)
        return "\t".join(cell.strip() for cell in body.split("|"))

    return _TABLE_ROW_RE.sub(_row, text)


def _cleanup(text, mode):
    output = _TRAILING_WS_RE.sub("\n", text)
    output = _BLANK_RE.sub("\n\n", output)
    output = _MULTI_SPACE_RE.sub(" ", output)
    return output.strip()


def convert(markdown, options=None):
    """Convert a Markdown string to plain text.

    ``options`` is merged on top of :data:`DEFAULT_OPTIONS`.
    """
    opts = dict(DEFAULT_OPTIONS)
    if options:
        opts.update(options)
        if "labels" not in opts:
            opts["labels"] = DEFAULT_LABELS

    text = _normalize(markdown)
    code_blocks = []

    if opts["remove_frontmatter"]:
        text = _FRONTMATTER_RE.sub("", text)

    def _stash_code(match):
        lang, code = match.group(1), match.group(2)
        if not opts["keep_code"]:
            return "\n"
        token = "@@CODE_BLOCK_{}@@".format(len(code_blocks))
        code_blocks.append(_format_code_block(code, lang, opts))
        return "\n{}\n".format(token)

    text = _FENCED_RE.sub(_stash_code, text)

    text = _COMMENT_RE.sub("", text)
    text = _BR_RE.sub("\n", text)
    text = _BLOCK_CLOSE_RE.sub("\n", text)
    text = _TAG_RE.sub("", text)

    if opts["keep_image_alt"]:
        text = _IMAGE_RE.sub(r"\1", text)
    else:
        text = _IMAGE_DROP_RE.sub("", text)

    link_repl = r"\1 (\2)" if opts["keep_links"] else r"\1"
    text = _LINK_INLINE_RE.sub(link_repl, text)
    text = _LINK_REF_RE.sub(r"\1", text)

    text = _convert_tables(text, opts["keep_tables"])

    text = _INLINE_CODE_RE.sub(r"\1", text)
    text = _BOLD_RE.sub(r"\2", text)
    text = _ITALIC_RE.sub(r"\2", text)
    text = _STRIKE_RE.sub(r"\1", text)

    text = _HEADING_RE.sub(lambda m: _format_heading(m, opts), text)

    if opts["keep_quote_prefix"]:
        text = _QUOTE_RE.sub("> ", text)
    elif opts["mode"] == "structured":
        text = _QUOTE_RE.sub("| ", text)
    else:
        text = _QUOTE_RE.sub("", text)

    if opts["keep_task_lists"]:
        text = _TASK_RE.sub(lambda m: "{}- {}".format(m.group(1), m.group(2)), text)
    else:
        task_repl = "" if opts["mode"] == "clean" else "- "
        text = _TASK_RE.sub(lambda m: m.group(1) + task_repl, text)

    list_repl = "" if opts["mode"] == "clean" else "- "
    text = _LIST_RE.sub(list_repl, text)

    if opts["mode"] == "clean":
        text = _ORDERED_RE.sub("", text)
    else:
        text = _ORDERED_RE.sub(lambda m: m.group(0).strip() + " ", text)

    for index, block in enumerate(code_blocks):
        text = text.replace("@@CODE_BLOCK_{}@@".format(index), block)

    return _decode_entities(_cleanup(text, opts["mode"]))


def convert_file(path, options=None, encoding="utf-8"):
    with open(path, "r", encoding=encoding) as handle:
        return convert(handle.read(), options)
