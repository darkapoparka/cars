import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('./publishing/preview-switcher.js', import.meta.url), 'utf8');
const variants = [
  { key: 'auto-best', base: '', entry: '/' },
  { key: 'modern', base: '/variant-2', entry: '/variant-2/cars' },
  { key: 'import', base: '/variant-3', entry: '/variant-3/' },
  { key: 'app', base: '/variant-4', entry: '/variant-4/' },
  { key: 'mobile', base: '/variant-5', entry: '/variant-5/' },
];
function config(overrides = {}) {
  return { language: 'bg', variants: structuredClone(variants), localization: {
    defaultLocale: 'bg', enabledLocales: ['en', 'bg'], messages: {
      en: { design: 'Design', choose: 'Choose', title: 'Choose a design' },
      bg: { design: 'Дизайн', choose: 'Избор', title: 'Избор на дизайн' },
    },
  }, ...overrides };
}

// In-memory DOM contract harness. No servers, network, browser profiles or files
// are created. This checks executable routing/focus logic, not visual acceptance.
function render(input = config(), address = 'https://dealer.example/bg', documentLanguage = 'bg') {
  let shadow;
  class Element {
    constructor(tag = 'div') { this.tagName = tag; this.children = []; this.dataset = {}; this.attributes = {}; this.listeners = {}; this.hidden = false; this.style = { setProperty() {} }; }
    append(...items) { this.children.push(...items); }
    setAttribute(key, value) { this.attributes[key] = value; }
    addEventListener(name, handler) { (this.listeners[name] ??= []).push(handler); }
    fire(name, event = {}) { for (const fn of this.listeners[name] ?? []) fn(event); }
    focus() { shadow.activeElement = this; }
    querySelectorAll(selector) {
      const matches = node => selector.split(',').some(part => part.startsWith('.')
        ? node.className?.split(' ').includes(part.slice(1))
        : part === '[aria-current="page"]' ? node.attributes['aria-current'] === 'page' : node.tagName === part);
      const found = [];
      const walk = node => { for (const child of node.children) { if (matches(child)) found.push(child); walk(child); } };
      walk(this); return found;
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] ?? null; }
    attachShadow() {
      shadow = new Element('shadow');
      const nodes = new Map();
      for (const name of ['fab', 'fab-artwork', 'sheet', 'backdrop', 'close', 'design-grid', 'heading', 'subtitle', 'fab-label', 'count', 'admin']) {
        const node = new Element(['fab', 'close'].includes(name) ? 'button' : name === 'admin' ? 'a' : 'div');
        node.className = name; nodes.set('.' + name, node);
      }
      nodes.get('.sheet').hidden = true;
      nodes.get('.backdrop').hidden = true;
      nodes.get('.sheet').append(nodes.get('.close'), nodes.get('.design-grid'), nodes.get('.admin'));
      nodes.get('.admin').append(new Element('strong'), new Element('small'));
      shadow.querySelector = selector => nodes.get(selector) ?? null;
      this.shadowRoot = shadow; return shadow;
    }
  }
  const document = new Element('document');
  document.documentElement = { lang: documentLanguage, style: { overflow: '' } };
  document.body = new Element('body'); document.head = new Element('head');
  document.createElement = tag => new Element(tag);
  document.querySelector = selector => document.body.children.find(node => selector.split(', ').includes(node.tagName)) ?? null;
  const current = new URL(address);
  const navigations = [];
  const location = { origin: current.origin, hostname: current.hostname, pathname: current.pathname, search: current.search, assign: value => navigations.push(value) };
  const timers = [];
  const context = vm.createContext({ document, location, URL, URLSearchParams,
    matchMedia: () => ({ matches: true }), setTimeout: fn => { timers.push(fn); return timers.length; }, clearTimeout() {}, queueMicrotask: fn => fn(),
  });
  const script = source.replace('__CARS_SWITCHER_CONFIG__', () => JSON.stringify(input).replaceAll('<', '\\u003c'));
  vm.runInContext(script, context, { timeout: 1000 });
  return { document, location, navigations, timers, script, context,
    get host() { return document.body.children[0]; },
    get links() { return shadow.querySelector('.design-grid').querySelectorAll('a'); },
    get shadow() { return shadow; },
  };
}

test('new five-design packages boot locally without remote JS or timeout', () => {
  const r = render();
  assert.equal(r.document.head.children.length, 0);
  assert.equal(r.timers.length, 0);
  assert.deepEqual(r.links.map(link => link.dataset.designKey), ['auto-best', 'modern', 'import', 'app', 'mobile']);
  assert.equal(r.shadow.querySelector('.count').textContent, '1/5');
  assert.equal(r.links[4].querySelector('.design-name').textContent, 'Мобилен');
  assert.match(r.links[4].querySelector('.preview').querySelector('img').src, /^data:image\/webp;base64,/);
});

test('Mobile uses query locale rather than nonexistent /bg and /en paths', () => {
  const r = render();
  assert.deepEqual(r.links.map(link => link.href), ['/bg', '/variant-2/bg/cars', '/variant-3/bg', '/variant-4/bg', '/variant-5/?lang=bg']);
});

test('Mobile query language controls all five destination links', () => {
  const r = render(config(), 'https://dealer.example/variant-5/vehicle/example?lang=en', 'bg');
  assert.equal(r.host.dataset.activeKey, 'mobile');
  assert.equal(r.shadow.querySelector('.count').textContent, '5/5');
  assert.equal(r.links[4].href, '/variant-5/?lang=en');
  assert.equal(r.links[1].href, '/variant-2/en/cars');
  assert.equal(r.links[4].querySelector('.design-name').textContent, 'Mobile');
});

test('language changes while Mobile is open update menu labels and destinations on open', () => {
  const r = render(config(), 'https://dealer.example/variant-5/?lang=bg');
  r.location.search = '?lang=en';
  r.document.documentElement.lang = 'en';
  r.shadow.querySelector('.fab').fire('click');
  assert.equal(r.links[4].href, '/variant-5/?lang=en');
  assert.equal(r.links[2].href, '/variant-3/en');
  assert.equal(r.links[4].querySelector('.design-name').textContent, 'Mobile');
  assert.equal(r.host.lang, 'en');
});

test('existing Import slot is preserved and Modern may occupy the old Carwow slot', () => {
  const changed = structuredClone(variants);
  changed[1] = { key: 'import', base: '/variant-2', entry: '/variant-2/' };
  changed[2] = { key: 'modern', base: '/variant-3', entry: '/variant-3/cars' };
  const r = render(config({ variants: changed }));
  assert.equal(r.links[1].href, '/variant-2/bg');
  assert.equal(r.links[2].href, '/variant-3/bg/cars');
  assert.equal(new Set(r.links.map(link => link.dataset.designKey)).size, 5);
});

test('unknown language falls back to the current document locale', () => {
  const r = render(config(), 'https://dealer.example/variant-5/?lang=unknown', 'en');
  assert.equal(r.links[4].href, '/variant-5/?lang=en');
});

test('legacy explicit shared runtime cannot override a Mobile release', () => {
  const r = render(config({ sharedRuntime: 'legacy-v2' }));
  assert.equal(r.document.head.children.length, 0);
  assert.equal(r.links.length, 5);
});

test('legacy four-design fallback remains available by explicit opt-in', () => {
  const r = render(config({ sharedRuntime: 'legacy-v2', variants: variants.slice(0, 4) }));
  assert.equal(r.document.head.children[0].src, 'https://cars-admin-blue.vercel.app/dealer-switcher/v2.js');
  assert.equal(r.document.body.children.length, 0);
  r.timers[0]();
  assert.equal(r.links.length, 4);
});

test('Escape closes the panel, restores page scrolling and returns focus', () => {
  const r = render();
  const fab = r.shadow.querySelector('.fab');
  fab.fire('click');
  assert.equal(r.shadow.querySelector('.sheet').hidden, false);
  assert.equal(r.document.documentElement.style.overflow, 'hidden');
  r.document.fire('keydown', { key: 'Escape', preventDefault() {}, stopImmediatePropagation() {} });
  assert.equal(r.shadow.querySelector('.sheet').hidden, true);
  assert.equal(r.document.documentElement.style.overflow, '');
  assert.equal(r.shadow.activeElement, fab);
});

test('duplicate injection does not append a second FAB', () => {
  const r = render();
  vm.runInContext(r.script, r.context, { timeout: 1000 });
  assert.equal(r.document.body.children.length, 1);
});

test('admin remains a separate link and is not counted as a sixth design', () => {
  const r = render();
  assert.equal(r.links.length, 5);
  assert.equal(new URL(r.shadow.querySelector('.admin').href).hostname, 'cars-admin-blue.vercel.app');
  assert.match(r.shadow.innerHTML, /target="_blank" rel="noopener noreferrer"/);
});

test('six-family selector displays Signature at the Karento source entry and keeps Admin separate', () => {
  const r = render(config({ variants: [...structuredClone(variants), { key: 'karento-best', base: '/variant-6', entry: '/variant-6/' }] }));
  assert.equal(r.links.length, 6);
  assert.equal(r.shadow.querySelector('.count').textContent, '1/6');
  assert.equal(r.links[5].href, '/variant-6/');
  assert.equal(r.links[5].querySelector('.design-name').textContent, 'Signature');
  assert.match(r.links[5].querySelector('.preview').querySelector('img').src, /^data:image\/webp;base64,/);
  assert.equal(new URL(r.shadow.querySelector('.admin').href).hostname, 'cars-admin-blue.vercel.app');
});

test('Karento deep links show the sixth choice and switch back to the right locale', () => {
  const r = render(config({ variants: [...structuredClone(variants), { key: 'karento-best', base: '/variant-6', entry: '/variant-6/' }] }), 'https://dealer.example/variant-6/vehicles', 'en');
  assert.equal(r.host.dataset.activeKey, 'karento-best');
  assert.equal(r.shadow.querySelector('.count').textContent, '6/6');
  assert.equal(r.links[5].attributes['aria-current'], 'page');
  assert.equal(r.links[5].href, '/variant-6/');
  assert.equal(r.links[0].href, '/en');
  assert.equal(r.links[4].href, '/variant-5/?lang=en');
  r.document.documentElement.lang = 'bg';
  r.shadow.querySelector('.fab').fire('click');
  assert.equal(r.links[5].href, '/variant-6/');
  assert.equal(r.links[0].href, '/bg');
});

test('Karento cannot be replaced by the legacy remote selector', () => {
  const r = render(config({ sharedRuntime: 'legacy-v2', variants: [...variants.slice(0, 4), { key: 'karento-best', base: '/variant-6', entry: '/variant-6/' }] }));
  assert.equal(r.document.head.children.length, 0);
  assert.equal(r.links.at(-1).dataset.designKey, 'karento-best');
});

test('all six styles use valid bundled WebP logos and the active FAB uses its own logo', () => {
  const six = [...structuredClone(variants), { key: 'karento-best', base: '/variant-6', entry: '/variant-6/' }];
  const r = render(config({ variants: six }), 'https://dealer.example/variant-6/vehicles', 'en');
  const images = r.links.map(link => link.querySelector('.preview').querySelector('img'));
  assert.equal(images.length, 6);
  for (const image of images) {
    assert.equal(image.alt, '');
    assert.match(image.src, /^data:image\/webp;base64,/);
    const bytes = Buffer.from(image.src.split(',')[1], 'base64');
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
  }
  assert.equal(new Set(images.map(image => image.src)).size, 6);
  assert.equal(r.shadow.querySelector('.fab').attributes['data-has-logo'], 'true');
  assert.equal(r.shadow.querySelector('.fab-artwork').querySelector('img').src, images[5].src);
  assert.equal(r.shadow.querySelector('.count').textContent, '6/6');
});

for (const name of ['deploy-autobest-release', 'fix-autobest-contact-localization', 'reconcile-canonical-fleet-once']) {
  test(name + ' does not publish on an ordinary source push', () => {
    const workflow = readFileSync(new URL('../.github/workflows/' + name + '.yml', import.meta.url), 'utf8');
    const trigger = workflow.slice(workflow.indexOf('\non:'), workflow.indexOf('\npermissions:'));
    assert.match(trigger, /workflow_dispatch:/);
    assert.doesNotMatch(trigger, /\b(?:push|pull_request|schedule):/);
    if (name === 'deploy-autobest-release') assert.doesNotMatch(workflow, /deploy --prod --force/);
  });
}
