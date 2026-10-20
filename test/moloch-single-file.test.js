import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../public/experiments/moloch/index.html', import.meta.url), 'utf8');

test('Moloch needs no external images, fonts, stylesheets, or scripts', () => {
  const resources = [...html.matchAll(/<(?:img|link|script)\b[^>]*(?:src|href)="([^"]+)"/g)];
  assert.ok(resources.length >= 17);
  resources.forEach(([, url]) => assert.match(url, /^data:/));
  const fonts = [...html.matchAll(/url\(["']?([^"')]+)["']?\)/g)];
  assert.ok(fonts.length >= 2);
  fonts.forEach(([, url]) => assert.match(url, /^data:/));
  assert.doesNotMatch(html, /@import\s|<script\b[^>]*\bsrc=/);
});

test('embedded SVGs do not contain external resource references', () => {
  const svgs = [...html.matchAll(/data:image\/svg\+xml;base64,([^"]+)"/g)];
  svgs.forEach(([, base64]) => {
    const svg = Buffer.from(base64, 'base64').toString('utf8');
    assert.doesNotMatch(svg, /(?:href|src)="(?!#|data:)/);
  });
});
