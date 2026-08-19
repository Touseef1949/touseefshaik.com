const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://touseefshaik.com';

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function sitemapEntries() {
  return [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function localPath(url) {
  const pathname = new URL(url).pathname;
  if (pathname === '/') return 'index.html';
  if (pathname.endsWith('/')) return `${pathname.slice(1)}index.html`;
  return pathname.slice(1);
}

function jsonLd(html, file) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      assert.fail(`${file} has invalid JSON-LD: ${error.message}`);
    }
  });
}

function graphTypes(documents) {
  return documents.flatMap((document) => (document['@graph'] || [document]).map((item) => item['@type']));
}

test('every sitemap URL maps to one canonical, indexable page', () => {
  const entries = sitemapEntries();
  assert.equal(entries.length, 53);

  for (const url of entries) {
    const file = localPath(url);
    assert.ok(fs.existsSync(path.join(ROOT, file)), `${url} is missing ${file}`);

    const html = read(file);
    assert.equal((html.match(/<h1\b/gi) || []).length, 1, `${file} must have exactly one H1`);
    assert.equal((html.match(/<meta charset="UTF-8">/gi) || []).length, 1, `${file} must have one valid charset declaration`);
    assert.doesNotMatch(html, /^\s*4\|/m, `${file} contains line-number debris`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`));
    assert.match(html, /<meta name="robots" content="index, follow">/);
    assert.match(html, /class="footer-legal"[\s\S]*href="\/privacy\/"[\s\S]*href="\/terms\/"/);
  }
});

test('titles and descriptions stay concise and useful', () => {
  for (const url of sitemapEntries()) {
    const file = localPath(url);
    const html = read(file);
    const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1]?.replace(/&amp;/g, '&') || '';
    const description = (html.match(/<meta name="description" content="([^"]*)"/i) || [])[1] || '';

    assert.ok(title.length > 0 && title.length <= 60, `${file} title length is ${title.length}`);
    assert.ok(description.length >= 120 && description.length <= 160, `${file} description length is ${description.length}`);
  }
});

test('editorial pages expose authorship, freshness, breadcrumbs, and structured data', () => {
  const editorial = sitemapEntries().filter((url) => /\/(blog|learn|evals|interview-prep)\//.test(url));
  assert.equal(editorial.length, 34);

  for (const url of editorial) {
    const file = localPath(url);
    const html = read(file);
    const documents = jsonLd(html, file);
    const types = graphTypes(documents);

    assert.match(html, /class="breadcrumbs"/);
    assert.match(html, /class="author-section"/);
    assert.match(html, /<time datetime="\d{4}-\d{2}-\d{2}">/);
    assert.match(html, /Updated <time datetime="2026-07-19">/);
    assert.ok(types.includes('BreadcrumbList'), `${file} needs BreadcrumbList JSON-LD`);
    assert.ok(
      types.some((type) => ['Article', 'TechArticle', 'CollectionPage'].includes(type)),
      `${file} needs editorial JSON-LD`,
    );
  }
});

test('app pages use breadcrumbs and schema only for live software', () => {
  const live = new Set([
    'apps/ba-assistant.html',
    'apps/ba-jira-agent.html',
    'apps/stock-research-assistant.html',
    'apps/chess-garden.html',
  ]);

  for (const url of sitemapEntries().filter((entry) => /\/apps\/[^/]+\.html$/.test(entry))) {
    const file = localPath(url);
    const html = read(file);
    const types = graphTypes(jsonLd(html, file));

    assert.match(html, /class="breadcrumbs"/);
    assert.ok(types.includes('BreadcrumbList'), `${file} needs BreadcrumbList JSON-LD`);
    assert.equal(types.includes('SoftwareApplication'), live.has(file), `${file} has incorrect app schema`);
  }
});

test('current flagship release links remain visible', () => {
  const releases = [
    'https://github.com/Touseef1949/BA_Assistant/releases/tag/v0.1.2',
    'https://github.com/Touseef1949/ba-jira-agent/releases/tag/v0.1.0',
    'https://github.com/Touseef1949/stock-research-assistant/releases/tag/v0.1.0',
  ];

  const productIndex = read('apps/index.html');
  const portfolio = read('portfolio/index.html');
  for (const release of releases) {
    assert.match(productIndex, new RegExp(release.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(portfolio, new RegExp(release.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('homepage proves the product, separates archives, and exposes four measurable paths', () => {
  const html = read('index.html');
  const script = read('assets/js/main.js');

  assert.match(html, /class="proof-section"/);
  assert.match(html, /<meta name="google-site-verification" content="[^"]+">/);
  assert.match(html, /real Standard-mode output generated by the live BA Assistant/);
  assert.match(html, /class="archive-panel"/);
  assert.equal((html.match(/class="path-card(?: |")/g) || []).length, 4);
  assert.equal((html.match(/data-event="path_[^"]+"/g) || []).length, 4);
  assert.match(script, /site:conversion/);
  assert.match(script, /fetch\('\/api\/events'/);
  assert.match(script, /keepalive: true/);
});

test('important internal links resolve to local files', () => {
  const missing = [];

  for (const url of sitemapEntries()) {
    const source = localPath(url);
    const html = read(source);
    for (const match of html.matchAll(/href="(\/[^"#?]*)/g)) {
      const target = match[1];
      const relative = target === '/' ? 'index.html' : target.endsWith('/') ? `${target.slice(1)}index.html` : target.slice(1);
      if (!fs.existsSync(path.join(ROOT, relative))) missing.push(`${source} -> ${target}`);
    }
  }

  assert.deepEqual(missing, []);
});

test('Chess Garden ships as a complete same-domain app package', () => {
  const productPage = read('apps/chess-garden.html');
  const gamePage = read('games/chess-garden/index.html');

  assert.match(productPage, /<iframe[^>]+src="\/games\/chess-garden\/"/);
  assert.match(gamePage, /<meta name="robots" content="noindex, follow">/);
  assert.match(gamePage, /<link rel="canonical" href="https:\/\/touseefshaik\.com\/apps\/chess-garden\.html">/);
  assert.match(gamePage, /aria-pressed="true"/);
  assert.equal((gamePage.match(/role="gridcell"/g) || []).length, 64);

  const missing = [];
  for (const match of gamePage.matchAll(/(?:href|src)="(\/games\/chess-garden\/[^"#?]+)"/g)) {
    const target = match[1].slice(1);
    if (!fs.existsSync(path.join(ROOT, target))) missing.push(target);
  }
  assert.deepEqual(missing, []);
});
