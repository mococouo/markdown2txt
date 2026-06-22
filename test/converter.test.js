'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const scriptPath = path.join(__dirname, '..', 'script.js');
const code = fs.readFileSync(scriptPath, 'utf8');

function makeEl(id) {
  return {
    id,
    value: '',
    textContent: '',
    innerHTML: '',
    className: '',
    checked: false,
    dataset: {},
    attributes: {},
    style: {},
    _listeners: {},
    addEventListener() {},
    removeEventListener() {},
    setAttribute(k, v) { this.attributes[k] = v; },
    getAttribute() { return null; },
    toggleAttribute() {},
    classList: { toggle() {}, add() {}, remove() {}, contains() { return false; } },
    querySelectorAll() { return []; },
    appendChild() {},
    removeChild() {},
    remove() {},
    click() {},
    focus() {},
    select() {},
    closest() { return null; },
    contains() { return false; },
    options: []
  };
}

const elementIds = [
  'markdown-input', 'txt-output', 'language-select', 'drop-area', 'file-upload',
  'paste-btn', 'sample-btn', 'convert-btn', 'copy-btn', 'download-btn',
  'download-all-btn', 'clear-input-btn', 'clear-files-btn', 'file-list',
  'status-bar', 'active-file-label', 'input-stats', 'output-stats',
  'keep-links', 'keep-code', 'remove-frontmatter', 'auto-convert'
];

const elements = {};
elementIds.forEach((id) => { elements[id] = makeEl(id); });

const sandbox = {
  document: {
    getElementById: (id) => elements[id] || null,
    querySelectorAll: () => [],
    createElement: () => makeEl('created'),
    addEventListener() {},
    documentElement: { lang: 'en', dir: 'ltr' },
    title: ''
  },
  window: { addEventListener() {}, localStorage: undefined },
  localStorage: {
    _store: {},
    getItem(k) { return this._store[k] || null; },
    setItem(k, v) { this._store[k] = v; },
    removeItem(k) { delete this._store[k]; }
  },
  navigator: { clipboard: { readText: async () => '', writeText: async () => {} } },
  performance: { now: () => Date.now() },
  FileReader: function () {},
  Blob: function () {},
  URL: { createObjectURL: () => 'blob:x', revokeObjectURL() {} },
  setTimeout,
  clearTimeout,
  Promise,
  Date,
  Math,
  JSON,
  String,
  Number,
  Boolean,
  Array,
  Object,
  RegExp,
  Error,
  console
};
sandbox.window.localStorage = sandbox.localStorage;

vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const baseOptions = (overrides) => Object.assign(
  { keepLinks: true, keepCode: true, removeFrontmatter: true, mode: 'normal' },
  overrides
);

const tests = [
  {
    name: 'A1: HTML entities preserved (no decode)',
    input: 'Use &amp; &lt; &gt; in text',
    expect: 'Use &amp; &lt; &gt; in text'
  },
  {
    name: 'A4: clean mode code blocks separated',
    input: 'Before\n```js\nconsole.log(1)\n```\nMiddle\n```\nsecond\n```\nAfter',
    expect: 'Before\n\nconsole.log(1)\n\nMiddle\n\nsecond\n\nAfter',
    options: { mode: 'clean' }
  },
  {
    name: 'A6: nested list preserves indent',
    input: '- parent\n  - child\n    - grandchild\n- top',
    expect: '- parent\n  - child\n    - grandchild\n- top'
  },
  {
    name: 'A6: nested ordered list preserves indent',
    input: '1. first\n   1. sub\n2. second',
    expect: '1. first\n   1. sub\n2. second'
  },
  {
    name: 'A6: clean mode nested list strips markers keeps indent',
    input: '- parent\n  - child\n- top',
    expect: 'parent\n  child\ntop',
    options: { mode: 'clean' }
  },
  {
    name: 'bold preserved as text',
    input: '**bold**',
    expect: 'bold'
  },
  {
    name: 'italic preserved as text',
    input: '*em*',
    expect: 'em'
  },
  {
    name: 'strikethrough preserved as text',
    input: '~~strike~~',
    expect: 'strike'
  },
  {
    name: 'inline code preserved',
    input: 'use `var x` here',
    expect: 'use var x here'
  },
  {
    name: 'image alt kept',
    input: '![alt text](img.png)',
    expect: 'alt text'
  },
  {
    name: 'reference link',
    input: '[site][1]\n[1]: http://x',
    expect: 'site'
  },
  {
    name: 'html comment removed',
    input: 'a<!-- hidden -->b',
    expect: 'ab'
  },
  {
    name: 'html tag stripped',
    input: '<p>hi</p>',
    expect: 'hi'
  },
  {
    name: 'br becomes newline',
    input: 'line1<br>line2',
    expect: 'line1\nline2'
  },
  {
    name: 'blockquote normal',
    input: '> quoted',
    expect: 'quoted'
  },
  {
    name: 'blockquote structured',
    input: '> quoted',
    expect: '| quoted',
    options: { mode: 'structured' }
  },
  {
    name: 'task list normal',
    input: '- [x] done\n- [ ] todo',
    expect: '- done\n- todo'
  },
  {
    name: 'task list clean',
    input: '- [x] done\n- [ ] todo',
    expect: 'done\ntodo',
    options: { mode: 'clean' }
  },
  {
    name: 'ordered list normal',
    input: '1. one\n2. two',
    expect: '1. one\n2. two'
  },
  {
    name: 'ordered list clean',
    input: '1. one\n2. two',
    expect: 'one\ntwo',
    options: { mode: 'clean' }
  },
  {
    name: 'table converted to tab',
    input: '| a | b |\n| --- | --- |\n| 1 | 2 |',
    expect: 'a\tb\n\n1\t2'
  },
  {
    name: 'h1 structured underline',
    input: '# T',
    expect: 'T\n=',
    options: { mode: 'structured' }
  },
  {
    name: 'h2 structured underline',
    input: '## T',
    expect: 'T\n-',
    options: { mode: 'structured' }
  },
  {
    name: 'h3 structured hash',
    input: '### T',
    expect: '### T',
    options: { mode: 'structured' }
  },
  {
    name: 'heading keeps following blank line',
    input: '# H\n\nbody',
    expect: 'H\n\nbody'
  },
  {
    name: 'code block normal mode with markers',
    input: '```js\nx=1\n```',
    expect: '--- Code js start ---\nx=1\n--- Code end ---'
  },
  {
    name: 'code block no lang',
    input: '```\nx=1\n```',
    expect: '--- Code start ---\nx=1\n--- Code end ---'
  },
  {
    name: 'code block removed when keepCode false',
    input: 'a\n```\nx=1\n```\nb',
    expect: 'a\n\nb',
    options: { keepCode: false }
  },
  {
    name: 'frontmatter kept when removeFrontmatter false',
    input: '---\ntitle: x\n---\n# Body',
    expect: '---\ntitle: x\n---\nBody',
    options: { removeFrontmatter: false }
  },
  {
    name: 'multiple code blocks with underscores in code',
    input: '```\n_a_\n```\n```\n_b_\n```',
    expect: '--- Code start ---\n_a_\n--- Code end ---\n\n--- Code start ---\n_b_\n--- Code end ---'
  },
  {
    name: 'crlf normalized',
    input: 'a\r\nb\r\nc',
    expect: 'a\nb\nc'
  },
  {
    name: 'bom stripped',
    input: '\uFEFFhello',
    expect: 'hello'
  },
  {
    name: 'sample converts fully',
    input: '---\ntitle: x\n---\n# H\n\n**b** and *i*\n\n- [x] a\n- b\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n\n```js\nconsole.log(1)\n```\n\n[link](http://x)',
    expect: 'H\n\nb and i\n\n- a\n- b\n\nA\tB\n\n1\t2\n\n--- Code js start ---\nconsole.log(1)\n--- Code end ---\n\nlink (http://x)'
  },
  {
    name: 'inline math preserved',
    input: 'Energy: $E=mc^2$ here',
    expect: 'Energy: E=mc^2 here'
  },
  {
    name: 'block math normal mode',
    input: 'Before\n$$\\frac{d}{dx}(e^x) = e^x$$\nAfter',
    expect: 'Before\n\n--- Math ---\n\\frac{d}{dx}(e^x) = e^x\n--- Math end ---\n\nAfter'
  },
  {
    name: 'block math clean mode',
    input: 'Before\n$$x^2$$\nAfter',
    expect: 'Before\n\nx^2\n\nAfter',
    options: { mode: 'clean' }
  },
  {
    name: 'footnote definitions removed',
    input: 'Text[^1]\n\n[^1]: explanation here',
    expect: 'Text'
  },
  {
    name: 'auto link kept with URL',
    input: 'Visit <http://example.com>',
    expect: 'Visit http://example.com'
  },
  {
    name: 'auto link dropped when keepLinks false',
    input: 'Visit <http://example.com>',
    expect: 'Visit',
    options: { keepLinks: false }
  },
  {
    name: 'allowed inline html preserved',
    input: 'Press <kbd>Ctrl</kbd> key',
    expect: 'Press <kbd>Ctrl</kbd> key'
  },
  {
    name: 'disallowed html stripped',
    input: '<div>wrapped</div>',
    expect: 'wrapped'
  },
  {
    name: 'admonition stripped to type',
    input: '!!! note Title\n    body text',
    expect: '[note] body text'
  },
  {
    name: 'definition list converted',
    input: 'Term\n: definition',
    expect: 'Term: definition'
  },
  {
    name: 'reference link definition removed',
    input: '[site][1]\n\n[1]: http://x.com',
    expect: 'site'
  },
  {
    name: 'image with empty alt',
    input: '![](img.png)',
    expect: ''
  }
];

let pass = 0;
let fail = 0;

tests.forEach((tc) => {
  const got = sandbox.markdownToText(tc.input, baseOptions(tc.options));
  if (got === tc.expect) {
    console.log('PASS', tc.name);
    pass += 1;
  } else {
    console.log('FAIL', tc.name);
    console.log('  expect:', JSON.stringify(tc.expect));
    console.log('  got:   ', JSON.stringify(got));
    fail += 1;
  }
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
