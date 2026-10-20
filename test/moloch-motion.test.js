import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const page = new URL('../public/experiments/moloch/index.html', import.meta.url);
const html = await readFile(page, 'utf8');
const source = html.match(/<script id="illustration-motion">\n([\s\S]*?)<\/script>/)?.[1];
assert.ok(source, 'the WebGL enhancement is embedded in the HTML');

// Browser checks cover real shader compilation and frames. This small DOM
// harness protects the static-first contract without needing a GPU in CI.
function setup({ reduced = false, paused = false, blockedStorage = false } = {}) {
  const events = {};
  const observers = [];
  const stats = { contexts: 0, decodes: 0, frames: 0 };
  const classes = new Set();
  const stored = new Map(paused ? [['moloch-motion-v1', 'paused']] : []);
  const element = () => ({
    hidden: true, attributes: {}, handlers: {},
    addEventListener(event, callback) { this.handlers[event] = callback; },
    setAttribute(name, value) { this.attributes[name] = value; },
  });
  const setting = element();
  const toggle = element();
  const dialog = { open: false };
  const image = { async decode() { stats.decodes++; } };
  const figure = {
    querySelector: () => image,
    classList: { add: name => classes.add(name), remove: name => classes.delete(name) },
  };
  const media = new Map();
  const matchMedia = query => {
    const result = {
      matches: query.includes('reduced-motion') && reduced,
      addEventListener(event, callback) { this.change = callback; },
    };
    media.set(query, result);
    return result;
  };
  class Observer {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe() {}
  }
  const document = {
    hidden: false,
    querySelector: selector => ({ '#index-dialog': dialog, '.motion-setting': setting, '#toggle-motion': toggle })[selector],
    querySelectorAll: () => [figure],
    createElement: () => ({ getContext() { stats.contexts++; return null; } }),
    addEventListener(event, callback) { events[event] = callback; },
  };
  vm.runInNewContext(source, {
    window: { IntersectionObserver: Observer, ResizeObserver: Observer },
    IntersectionObserver: Observer, ResizeObserver: Observer, MutationObserver: Observer,
    document, matchMedia,
    localStorage: {
      getItem(key) { if (blockedStorage) throw new Error('Restricted storage'); return stored.get(key); },
      setItem(key, value) { if (blockedStorage) throw new Error('Restricted storage'); stored.set(key, value); },
    },
    requestAnimationFrame() { stats.frames++; return 1; },
    cancelAnimationFrame() {},
    addEventListener(event, callback) { events[event] = callback; },
  });
  return {
    stats, classes, setting, toggle, stored, document, events, media,
    visible: () => observers[0].callback([{ target: figure, isIntersecting: true }]),
  };
}
const settle = () => new Promise(resolve => setImmediate(resolve));

test('cover sigil has no decorative red ring; motion is an inline enhancement', () => {
  assert.doesNotMatch(html, /\.hero-art::?before/);
  assert.match(html, /<script id="illustration-motion">/);
  assert.match(html, /id="toggle-motion"[^>]*aria-pressed="true"/);
});

test('motion does not allocate a WebGL context until an illustration enters the viewport', () => {
  const harness = setup();
  assert.equal(harness.stats.contexts, 0);
  assert.equal(harness.stats.decodes, 0);
  assert.equal(harness.stats.frames, 0);
});

test('reduced motion starts static and never attempts WebGL', async () => {
  const harness = setup({ reduced: true });
  harness.visible();
  await settle();
  assert.equal(harness.stats.contexts, 0);
  assert.equal(harness.stats.frames, 0);
  assert.equal(harness.setting.hidden, true);
  assert.equal(harness.classes.size, 0);
});

test('missing WebGL leaves the SVG untouched and disables the motion control', async () => {
  const harness = setup();
  harness.visible();
  await settle();
  assert.equal(harness.stats.contexts, 1);
  assert.equal(harness.stats.frames, 0);
  assert.equal(harness.classes.size, 0);
  assert.equal(harness.setting.hidden, true);
  harness.visible();
  await settle();
  assert.equal(harness.stats.contexts, 1, 'no repeated attempts on unsupported devices');
});

test('saved pause is honored and the toggle persists the new preference', async () => {
  const harness = setup({ paused: true });
  harness.visible();
  await settle();
  assert.equal(harness.stats.contexts, 0);
  assert.equal(harness.toggle.attributes['aria-pressed'], 'false');
  harness.toggle.handlers.click();
  assert.equal(harness.stored.get('moloch-motion-v1'), 'playing');
  await settle();
  assert.equal(harness.stats.contexts, 1);
});

test('hidden documents defer work until they become visible', async () => {
  const harness = setup();
  harness.document.hidden = true;
  harness.events.visibilitychange();
  harness.visible();
  await settle();
  assert.equal(harness.stats.contexts, 0);
  harness.document.hidden = false;
  harness.events.visibilitychange();
  await settle();
  assert.equal(harness.stats.contexts, 1);
});

test('restricted storage does not break the enhancement or static fallback', async () => {
  const harness = setup({ blockedStorage: true });
  assert.doesNotThrow(() => harness.toggle.handlers.click());
  assert.doesNotThrow(() => harness.toggle.handlers.click());
  harness.visible();
  await settle();
  assert.equal(harness.stats.contexts, 1);
  assert.equal(harness.classes.size, 0);
});
