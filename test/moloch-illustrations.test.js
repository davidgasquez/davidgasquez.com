import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const page = new URL('../public/experiments/moloch/index.html', import.meta.url);
const html = await readFile(page, 'utf8');

const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];

test('chapter symbols share the numeral row with the title directly below', () => {
  const headers = [...html.matchAll(/<div class="chapter-kicker"><span>([^<]+)<\/span><i aria-hidden="true"><\/i>(<img[^>]+>)<\/div><h2>([^<]+)<\/h2>/g)];
  assert.equal(headers.length, 8);
  assert.deepEqual(headers.map(match => match[1]), ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']);
  headers.forEach(([, , image]) => {
    assert.equal(attribute(image, 'aria-hidden'), 'true');
    assert.equal(attribute(image, 'alt'), '');
    assert.equal(attribute(image, 'width'), '48');
    assert.equal(attribute(image, 'height'), '48');
  });
  assert.doesNotMatch(html, /ritual-divider/);
});

test('Moloch places each narrative illustration in its relevant chapter', () => {
  const expected = ['lake', 'city', 'coordination', 'river', 'abyss', 'garden', null, null];
  const chapters = [...html.matchAll(/<section id="capitulo-(\d+)"[\s\S]*?<\/section>/g)];
  assert.equal(chapters.length, expected.length);

  chapters.forEach(([chapter], index) => {
    const illustrations = [...chapter.matchAll(/data-illustration="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(illustrations, expected[index] ? [expected[index]] : []);
  });
});

test('all thirteen supplied SVGs are embedded without changing the artwork', async () => {
  const embedded = new Set([...html.matchAll(/(?:src|href)="data:image\/svg\+xml;base64,([^"]+)"/g)]
    .map(match => Buffer.from(match[1], 'base64').toString('utf8')));
  const paths = ['sigil', 'lake', 'city', 'coordination', 'river', 'abyss', 'garden',
    'symbols/trampa', 'symbols/corriente', 'symbols/semilla', 'symbols/sacrificio', 'symbols/ojo', 'symbols/flores'];
  assert.equal(embedded.size, paths.length);

  for (const path of paths) {
    const svg = await readFile(new URL(`illustrations/${path}.svg`, page), 'utf8');
    assert.ok(embedded.has(svg), `${path} is embedded verbatim`);
    assert.match(svg, /^<svg\b/);
    assert.doesNotMatch(svg, /<script\b|<foreignObject\b|\bonload\s*=/i);
  }
});

test('narrative images reserve their space and provide accessible descriptions', () => {
  const figures = [...html.matchAll(/<figure class="narrative-figure"[^>]*><img\b([^>]+)>/g)];
  assert.equal(figures.length, 6);

  for (const [, image] of figures) {
    assert.ok(attribute(image, 'alt')?.length > 30);
    assert.ok(Number(attribute(image, 'width')) > 0);
    assert.ok(Number(attribute(image, 'height')) > 0);
    assert.equal(attribute(image, 'loading'), 'lazy');
    assert.equal(attribute(image, 'decoding'), 'async');
  }
});
