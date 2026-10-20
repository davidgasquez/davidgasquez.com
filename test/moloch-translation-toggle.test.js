import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const html = await readFile(new URL('../public/experiments/moloch/index.html', import.meta.url), 'utf8');
const script = html.slice(html.indexOf('  const translationButtons ='), html.indexOf('  setSize(0, false);'));

function setup() {
  const element = () => {
    const classes = new Set();
    return {
      attributes: {}, handlers: {}, hidden: true,
      classList: {
        contains: name => classes.has(name),
        remove: name => classes.delete(name),
        toggle(name, force = !classes.has(name)) {
          if (force) classes.add(name); else classes.delete(name);
          return force;
        },
      },
      setAttribute(name, value) { this.attributes[name] = value; },
      removeAttribute(name) { delete this.attributes[name]; },
      addEventListener(name, callback) { this.handlers[name] = callback; },
      matches: selector => selector === 'p.bilingual',
      closest(selector) { return selector === 'p.bilingual' ? this : null; },
    };
  };
  const buttons = [element(), element()];
  const paragraphs = [element(), element()];
  const hint = { textContent: '' };
  const article = element();
  article.querySelectorAll = () => paragraphs;
  vm.runInNewContext(script, {
    article, document: { querySelectorAll: () => buttons },
    $: () => hint, getSelection: () => ({ isCollapsed: true }),
  });
  return { buttons, paragraphs, hint, article };
}

test('original-language mode is an opt-in next to both font-size controls', () => {
  for (const container of ['reading-tools', 'dialog-tools']) {
    const tools = html.match(new RegExp(`<div class="${container}">[\\s\\S]*?</div></div>`))[0];
    assert.match(tools, /data-size="-1"/);
    assert.match(tools, /class="translation-toggle"[^>]*aria-pressed="false"/);
  }
  const paragraphs = [...html.matchAll(/<p\b[^>]*class="[^"]*\bbilingual\b[^"]*"[^>]*>/g)];
  assert.equal(paragraphs.length, 240);
  paragraphs.forEach(([tag]) => assert.doesNotMatch(tag, /tabindex|aria-describedby/));
  assert.match(html, /\.original-enabled \.bilingual:hover>\.original/);
});

test('hover mode starts disabled and clicks and keyboard cannot reveal English', () => {
  const { buttons, paragraphs, article } = setup();
  assert.equal(article.classList.contains('original-enabled'), false);
  buttons.forEach(button => assert.equal(button.attributes['aria-pressed'], 'false'));
  article.handlers.click({ target: paragraphs[0] });
  article.handlers.keydown({ target: paragraphs[0], key: 'Enter', preventDefault() { assert.fail('disabled keyboard handling'); } });
  paragraphs.forEach(paragraph => {
    assert.equal(paragraph.classList.contains('show-original'), false);
    assert.equal(paragraph.attributes.tabindex, undefined);
  });
});

test('both toggles stay synchronized, enable keyboard access, and clear English on disable', () => {
  const { buttons, paragraphs, article } = setup();
  buttons[0].handlers.click();
  assert.equal(article.classList.contains('original-enabled'), true);
  buttons.forEach(button => assert.equal(button.attributes['aria-pressed'], 'true'));
  paragraphs.forEach(paragraph => assert.equal(paragraph.attributes.tabindex, '0'));
  article.handlers.click({ target: paragraphs[0] });
  assert.equal(paragraphs[0].classList.contains('show-original'), true);
  buttons[1].handlers.click();
  assert.equal(article.classList.contains('original-enabled'), false);
  buttons.forEach(button => assert.equal(button.attributes['aria-pressed'], 'false'));
  paragraphs.forEach(paragraph => {
    assert.equal(paragraph.classList.contains('show-original'), false);
    assert.equal(paragraph.attributes.tabindex, undefined);
    assert.equal(paragraph.attributes['aria-describedby'], undefined);
  });
});
